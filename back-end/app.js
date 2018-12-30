var util = require("util");
var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var cors = require("cors");
var app = express();
var server = require('http').createServer(app);
var mongoose = require("mongoose");
var path = require("path");
var jwt = require("jsonwebtoken");
var config = require("./config");
var io = require('socket.io')(server);
var getContactsList = require('./getContactsList.js')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

var port = process.env.PORT || 5555;
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/universitychat");
app.set("superSecret", config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(require('./api'));


var User = require('./model/Users.js')
var Message = require('./model/Messages.js')


var onlineUsers = {};
var activeChat = {};

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.secret, function (err, decoded) {
            if (err) {
                next(new Error('Authentication error'));
            } else {
                socket.decoded = decoded
                next();
            }
        })
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', function (socket) {
    onlineUsers[socket.decoded.user.username] = socket;

    socket.on('chat', function (data, callback) {
        var username = socket.decoded.user.username

        Message.aggregate([
            {
                $match: {
                    $or: [{
                        writer: username,
                        audiencer: data.contactUsername
                    }, {
                        writer: data.contactUsername,
                        audiencer: username
                    }]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "audiencer",
                    foreignField: "username",
                    as: "audiencerArray"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "writer",
                    foreignField: "username",
                    as: "writerArray"
                }
            },
            {
                $sort: {
                    created_at: 1
                }
            }
        ], function (err, result) {
            if (err) {
                return;
            }
            else {
                socket.emit('chat', result);

                User.aggregate([
                    {
                        $match: {
                            username: data.contactUsername
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            nameAndFamily: 1,
                            lastActivity: 1,
                            profilePic: 1
                        }
                    }
                ], function (err, resultcontact) {
                    if (!err && resultcontact && resultcontact.length) {
                        socket.emit('chatContact', resultcontact[0]);
                    }
                })

                Message.updateMany(
                    {
                        writer: data.contactUsername,
                        audiencer: username
                    },
                    {
                        isReaded: true
                    },
                    function (err, updateresult) {
                        if (!err && updateresult) {

                            getContactsList(Message, socket, username)

                            activeChat[username] = data.contactUsername
                        }
                    }
                )
            }
        })

        setInterval(function () {
            var onlineStatus = data.contactUsername in onlineUsers ? true : false
            socket.emit('chatContactOnlineStatus', { status: onlineStatus })
        }, 3000);

    })


    var username = socket.decoded.user.username
    getContactsList(Message, socket, username)


    socket.on('send', function (data, callback) {
        var username = socket.decoded.user.username

        if (activeChat[data.audiencer] && activeChat[data.audiencer] == username) {
            var newMessage = new Message({
                content: data.content ? data.content : '',
                media: data.media ? data.media : '',
                writer: username,
                audiencer: data.audiencer,
                isReaded: true,
            })
        }
        else {
            var newMessage = new Message({
                content: data.content ? data.content : '',
                media: data.media ? data.media : '',
                writer: username,
                audiencer: data.audiencer,
                isReaded: false,
            })
        }

        newMessage.save(function (err, newMessageResult) {

            if (!err && newMessageResult) {

                socket.emit('newMessage', newMessageResult);

                if (onlineUsers[data.audiencer] && onlineUsers[data.audiencer] != '') {
                    onlineUsers[data.audiencer].emit('newMessage', newMessageResult)
                }

                getContactsList(Message, socket, username)

                if (onlineUsers[data.audiencer] && onlineUsers[data.audiencer] != '') {
                    Message.aggregate([
                        {
                            $match: {
                                $or: [
                                    {
                                        "writer": data.audiencer
                                    },
                                    {
                                        "audiencer": data.audiencer
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "audiencer",
                                foreignField: "username",
                                as: "audiencerObject"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "writer",
                                foreignField: "username",
                                as: "writerObject"
                            }
                        },
                        {
                            $sort: {
                                created_at: 1
                            }
                        },
                        {
                            "$group": {
                                "_id": { $cond: [{ $eq: ["$writer", data.audiencer] }, "$audiencer", "$writer"] },
                                "nameAndFamily": { $first: { $cond: [{ $eq: ["$writer", data.audiencer] }, "$audiencerObject.nameAndFamily", "$writerObject.nameAndFamily"] } },
                                "profilePic": { $first: { $cond: [{ $eq: ["$writer", data.audiencer] }, "$audiencerObject.profilePic", "$writerObject.profilePic"] } },
                                "unreaded": {
                                    $sum: { $cond: [{ $and: [{ $ne: ["$writer", data.audiencer] }, { $eq: ["$isReaded", false] }] }, 1, 0] },
                                },
                                "lastMessage": { $last: "$content" }
                            },
                        },
                    ], function (err, contacts) {
                        if (err) {
                            return;
                        }
                        else {
                            onlineUsers[data.audiencer].emit('contacts', contacts);
                        }
                    })
                }

            }
            else {
                return;
            }
        })
    })

    socket.on('disconnect', function () {
        console.log('client disconnect...', socket.id)
        delete onlineUsers[socket.decoded.user.username];
        delete activeChat[socket.decoded.user.username]
    })

    socket.on('error', function (err) {
        console.log('received error from client:', socket.id)
        console.log(err)
    })
})



server.listen(port, function () {
    console.log("server is running on port 5555");
});
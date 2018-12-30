var config = require("./config.js")
var router = require('express').Router()
var path = require("path")
const crypto = require("crypto")
var jwt = require("jsonwebtoken")
var uploaderScript = require('./uploaderScript.js')
var avatarUploader = require('./avatarUploader.js')
var authCheck = require('./authCheck.js')
var User = require('./model/Users.js')


// user login
router.post("/auth/login", function (req, res) {

    User.findOne({
        username: req.body.username
    }).exec(function (err, user) {
        if (err) {
            return res.status(500).send({
                statusCode: 500,
                success: false,
            })
        }
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                success: false,
            })
        } else if (user) {
            var userEnteredPass = req.body.password
            var encodedPass = crypto
                .createHmac("sha256", userEnteredPass)
                .update(config.secret)
                .digest("hex")

            if (user.password != encodedPass) {
                return res.status(403).send({
                    statusCode: 403,
                    success: false,
                })
            } else {
                var token = jwt.sign({ user: user }, config.secret, {
                    expiresIn: "48h"
                })

                // return the information including token as JSON
                return res.status(200).send({
                    statusCode: 200,
                    success: true,
                    data: {
                        token: token
                    }
                })
            }
        }
    })
});


// Register a user
router.post("/auth/register", async function (req, res) {
    let requiredError = [];

    if (!req.body.password || req.body.password == '') {
        requiredError.push({
            field: 'password'
        })
    }
    else if (!req.body.username || req.body.username == '') {
        requiredError.push({
            field: 'username'
        })
    }
    else if (!req.body.nameAndFamily || req.body.nameAndFamily == '') {
        requiredError.push({
            field: 'nameAndFamily'
        })
    }

    req.check('password', 'گذرواژه حداقل باید ۶ کاراکتر باشد').isLength({ min: 6 })
    var validationErrors = req.validationErrors();

    if (requiredError.length) {
        return res.send({
            statusCode: 400,
            success: false,
            data: { error: 'فیلد ها را کامل کنید و دوباره تلاش کنید!' }
        })
    }
    else if (validationErrors.length) {
        return res.send({
            statusCode: 400,
            success: false,
            data: { error: 'گذرواژه باید حداقل ۶ کاراکتر باشد!' }
        })
    }
    else {

        const hashPass = crypto
            .createHmac("sha256", req.body.password)
            .update(config.secret)
            .digest("hex");

        var newUser = new User({
            password: hashPass,
            username: req.body.username,
            nameAndFamily: req.body.nameAndFamily,
            lastActivity: new Date()
        })

        newUser.save(async function (err, savedUser) {
            if (err) {
                return res.status(500).send({
                    statusCode: 500,
                    success: false,
                    data: { error: "مشکلی در ذخیره سازی اطلاعات در پایگاه داده به وجود آمد!" }
                })
            }
            else {
                console.log('salam')
                var token = jwt.sign({ user: savedUser }, config.secret, {
                    expiresIn: "48h"
                })

                // return the information including token as JSON
                return res.status(201).send({
                    statusCode: 201,
                    success: true,
                    data: {
                        token: token,
                        username: savedUser.username
                    }
                })
            }
        })
    }
});


// duplicate username check
router.get("/auth/usernamecheck/:username", function (req, res) {
    var checkableUsername = req.params.username
    User.find({ username: checkableUsername }).exec(function (err, response) {
        if (response.length) {
            console.log(response)
            res.send({
                statusCode: 200
            })
        } else {
            res.send({
                statusCode: 404
            })
        }
    })
});


// upload a file to use in chat
router.post("/chats/upload", authCheck, uploaderScript, async function (req, res) {

    let uploadedAvatar = await req.files.file[0]

    if (!req.files.file.length || !uploadedAvatar) {
        return res.status(500).send({
            statusCode: 500,
            success: false,
        })
    }
    else {
        return res.status(200).send({
            statusCode: 200,
            success: true,
            data: {
                file: uploadedAvatar.path
            }
        })
    }
});



// main site auth status check (for menu rendering and so on...)
router.get("/auth/authcheck", authCheck, function (req, res) {

    if (req.decoded) {
        let user = req.decoded.user

        return res.status(200).send({
            statusCode: 200,
            success: true,
            data: {
                isAuth: true,
                user: user
            }
        })
    }
    else {
        return res.status(403).send({
            statusCode: 403,
            success: false,
            data: {
                isAuth: false,
                user: null
            }
        })
    }
})


// get current avatar image
router.get("/editprofile/avatar", authCheck, function (req, res) {
    if (req.decoded) {
        let user = req.decoded.user

        User.aggregate([
            {
                $match: {
                    username: user.username
                }
            }
        ], function (err, result) {
            if (err || !result.length) {
                return res.status(500).send({
                    statusCode: 500,
                    success: false
                })
            }
            else if (!result[0].profilePic || result[0].profilePic == '') {
                return res.status(404).send({
                    statusCode: 404,
                    success: false
                })
            }
            else {
                return res.status(200).send({
                    statusCode: 200,
                    success: true,
                    data: {
                        image: result[0].profilePic
                    }
                })
            }
        })
    }
    else {
        return res.status(403).send({
            statusCode: 403,
            success: false
        })
    }

})


// upload a new avatar image
router.put("/editprofile/avatar", authCheck, avatarUploader, async function (req, res) {
    let uploadedAvatar = await req.files.file[0]

    if (!req.files.file.length || !uploadedAvatar) {
        return res.status(500).send({
            statusCode: 500,
            success: false,
        })
    }
    else {
        User.updateOne({ username: req.decoded.user.username }, { profilePic: uploadedAvatar.path }, function (err, result) {
            if (err) {
                return res.status(500).send({
                    statusCode: 500,
                    success: false
                })
            }
            else {
                return res.status(200).send({
                    statusCode: 200,
                    success: true
                })
            }
        })

    }
})


// delete current avatar image
router.delete("/editprofile/avatar", authCheck, function (req, res) {
    if (req.decoded) {
        let user = req.decoded.user

        User.updateOne({ username: req.decoded.user.username }, { profilePic: '' }, function (err, result) {
            if (err) {
                return res.status(500).send({
                    statusCode: 500,
                    success: false
                })
            }
            else {
                return res.status(200).send({
                    statusCode: 200,
                    success: true
                })
            }
        })
    }
    else {
        return res.status(403).send({
            statusCode: 403,
            success: false
        })
    }

})


// get current user info
router.get("/editprofile/userinfo", authCheck, function (req, res) {
    if (req.decoded) {
        let user = req.decoded.user

        User.aggregate([
            {
                $match: {
                    username: user.username
                }
            }
        ], function (err, result) {
            if (err || !result.length) {
                return res.status(500).send({
                    statusCode: 500,
                    success: false
                })
            }
            else {
                return res.status(200).send({
                    statusCode: 200,
                    success: true,
                    data: {
                        nameAndFamily: result[0].nameAndFamily
                    }
                })
            }
        })
    }
    else {
        return res.status(403).send({
            statusCode: 403,
            success: false
        })
    }
})


// update user info with new data
router.put("/editprofile/userinfo", authCheck, function (req, res) {
    if (req.decoded) {
        let user = req.decoded.user

        var editedFields = {}

        if (req.body.password) {
            console.log('req.body.password', req.body.password)

            var encodedPass = crypto
                .createHmac("sha256", req.body.password)
                .update(config.secret)
                .digest("hex");

            editedFields.password = encodedPass
        }
        if (req.body.nameAndFamily) {
            editedFields.nameAndFamily = req.body.nameAndFamily
        }
        console.log(editedFields)

        User.updateOne({ username: user.username }, editedFields, function (err, result) {
            if (err) {
                return res.status(500).send({
                    statusCode: 500,
                    success: false
                })
            }
            else {
                return res.status(200).send({
                    statusCode: 200,
                    success: true
                })
            }
        })
    }
    else {
        return res.status(403).send({
            statusCode: 403,
            success: false
        })
    }
})


// search in users
router.get("/contacts/search", authCheck, function (req, res) {
    if (req.decoded) {
        let user = req.decoded.user

        if (req.query.term && req.query.term != '') {
            User.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                $and: [
                                    { username: { "$regex": req.query.term, "$options": "i" } },
                                    { username: { "$ne": user.username } }
                                ]
                            },
                            {
                                $and: [
                                    { nameAndFamily: { "$regex": req.query.term, "$options": "i" } },
                                    { username: { "$ne": user.username } }
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        "nameAndFamily": 1,
                        "profilePic": 1,
                        "username": 1,
                        "unreaded": '',
                        "lastMessage": ''
                    }
                },
                {
                    "$group": {
                        "_id": "$username",
                        "nameAndFamily": { $first: "$nameAndFamily" },
                        "profilePic": { $first: "$profilePic" },
                    },
                }

            ], function (err, searchResult) {
                if (err) {
                    console.log(err)
                    return res.status(500).send({
                        statusCode: 500,
                        success: false
                    })
                }
                else {
                    return res.status(200).send({
                        statusCode: 200,
                        success: true,
                        data: {
                            contacts: searchResult
                        }
                    })
                }
            })
        }
        else {
            return res.status(200).send({
                statusCode: 200,
                success: true,
                data: {
                    contacts: []
                }
            })
        }
    }
    else {
        return res.status(403).send({
            statusCode: 403,
            success: false
        })
    }
})


module.exports = router;
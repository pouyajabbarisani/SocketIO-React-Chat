function getContactsList(Message, socket, username) {
    Message.aggregate([
        {
            $match: {
                $or: [
                    {
                        "writer": username
                    },
                    {
                        "audiencer": username
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
                "_id": { $cond: [{ $eq: ["$writer", username] }, "$audiencer", "$writer"] },
                "nameAndFamily": { $first: { $cond: [{ $eq: ["$writer", username] }, "$audiencerObject.nameAndFamily", "$writerObject.nameAndFamily"] } },
                "profilePic": { $first: { $cond: [{ $eq: ["$writer", username] }, "$audiencerObject.profilePic", "$writerObject.profilePic"] } },
                "unreaded": {
                    $sum: { $cond: [{ $and: [{ $ne: ["$writer", username] }, { $eq: ["$isReaded", false] }] }, 1, 0] },
                },
                "lastMessage": { $last: "$content" },
                "createdate": { $last: "$created_at" }
            },
        },
        {
            $sort: {
                createdate: -1
            }
        },
    ], function (err, contacts) {
        if (err) {
            return;
        }
        else {
            socket.emit('contacts', contacts);
        }
    })
}

module.exports = getContactsList;


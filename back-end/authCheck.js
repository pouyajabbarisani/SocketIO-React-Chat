var config = require("./config")
var jwt = require("jsonwebtoken")


function authCheck(req, res, next) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"]
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    statusCode: 401,
                    success: false,
                    data: { error: "Failed-to-auth" }
                })
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).send({
            statusCode: 403,
            success: false,
            data: { error: "No-token-provided" }
        })
    }
}


module.exports = authCheck;


var multer = require("multer")
var maxSize = 1048576 // 1mb

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/avatarupload/")
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname
        var extension = originalname.split(".")
        filename =
            "avatar-" +
            req.decoded.user.username +
            "-" +
            Date.now() +
            "." +
            extension[extension.length - 1]
        cb(null, filename)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var originalname = file.originalname
        var extension = originalname.split(".")
        ext = extension[extension.length - 1]
        if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
            return callback(new Error("undefined-format"))
        }
        callback(null, true)
    },
    limits: { fileSize: maxSize }
})

var chatFileUpload = upload.fields([
    { name: "file", maxCount: 1 }
])


module.exports = chatFileUpload;


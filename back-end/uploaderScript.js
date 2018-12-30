var multer = require("multer")
var maxSize = 5242880 // 5mb

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/upload/")
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname
        var extension = originalname.split(".")
        filename =
            "chat-" +
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
        if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext != "pdf" && ext != "txt" && ext != "docx" && ext != "doc" && ext != "avi" && ext != "flv" && ext != "wmv" && ext != "mp4" && ext != "mp3" && ext != "mov") {
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


function randomStringGenerator() {
    var randString = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++) {
        randString += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randString;
}


module.exports = randomStringGenerator;

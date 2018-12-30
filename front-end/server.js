var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 6565;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


app.listen(port, function () {
    console.log('server is running on port 6565');
});



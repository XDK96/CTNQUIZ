"use strict";
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// use port 8000 unless there exists a preconfigured port
var port = process.env.PORT || 8000;

app.listen(port);
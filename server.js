var path = require('path');
var express = require('express');
var app = express();
var webpack = require('webpack');
var config = require('./config/webpackDevServer.config');
var server = require('http').createSrver(app);
var io = require('socket.io')(server);
var compiler = webpack(config);

app.use(express.static(path.join(_dirname,'/')));


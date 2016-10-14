#!/usr/bin/env node


var fs = require('fs');
var Path = require('path');
var express = require('express');
var app = express();
var mkpath = require('yow').mkpath;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sprintf = require('yow').sprintf;
var redirectLogs = require('yow').redirectLogs;
var prefixLogs = require('yow').prefixLogs;


var cmd = require('commander');


cmd.version('1.0.0');
cmd.option('-l --log', 'redirect logs to file');
cmd.option('-p --port <port>', 'listens to specified port', 80);
cmd.option('-r --root <dir>', 'specifies root path', Path.join(process.env.HOME, 'www'));
cmd.parse(process.argv);

prefixLogs();


if (cmd.log) {
	var date = new Date();
	var logFile = sprintf('%s/logs/%04d-%02d-%02d-%02d-%02d-%02d.log', __dirname, date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());

	mkpath(logFile);
	redirectLogs(logFile);
}

app.use(express.static(cmd.root));


server.listen(cmd.port, function () {
	console.log('Root path is %s.', cmd.root);
	console.log('Listening on port %d...', cmd.port);
});

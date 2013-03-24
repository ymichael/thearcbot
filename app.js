var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//
// IRC Client
//
var irc = require('node-irc');
var bot = new irc('irc.freenode.net', 6667, 'arcbot', 'arcbot');
bot.connect();
bot.on('ready', function() {
  bot.join('##arc3217 asdf');
});

//
// handle incoming requests
//
app.post('/', function(req, res) {
  var message = req.body.msg;
  bot.say('##arc3217', message);
  res.send(200);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("IRC bot listening on port " + app.get('port'));
});

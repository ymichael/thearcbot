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

// //
// // IRC Client
// //
var irc = require('irc');
// var bot = new irc.Client('chat.freenode.net', 'arcbot', {
//   // debug: true,
//   channels: ['##arc3217 asdf']
// });

// bot.addListener('error', function(message) {
//     console.log('error: ', message);
// });

//
// parse message
//
var parse = function(message) {
  // irc handles.
  message = message.replace("Michael Yong", "ymichael", "gi");
  message = message.replace("Omer Iqbal", "olenhad", "gi");
  message = message.replace("Jerome Cheng", "ayulin", "gi");
  message = message.replace("Benedict Liang", "ben_", "gi");

  // color branch
  var re = new RegExp("\\(.+?\\)");
  var branch = re.exec(message)[0];
  message = message.replace(branch, irc.colors.wrap("dark_red", branch));
  return message;
};

//
// handle incoming requests
//
app.post('/', function(req, res) {
  var message = parse(req.body.msg);
  // bot.say('##arc3217', message);
  console.log(message);
  res.send(200);
});

// start application
http.createServer(app).listen(app.get('port'), function(){
  console.log("IRC bot listening on port " + app.get('port'));
});
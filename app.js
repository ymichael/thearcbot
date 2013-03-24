var express = require('express');
var _ = require('underscore');
var http = require('http');
var path = require('path');
var irc = require('irc');
var twss = require('twss');

// colors (not working)
require('irc-colors').global();

//
// global constants
//
var BOT_NICK = "thearcbot";
var NICKS = {
  "Michael Yong": "ymichael",
  "Omer Iqbal": "olenhad",
  "Jerome Cheng": "ayulin",
  "Benedict Liang": "ben_"
};
var CHANNEL = "##arc3217";

//
// IRC Client
//
var bot = new irc.Client('chat.freenode.net', BOT_NICK, {
  // debug: true,
  channels: [CHANNEL]
});

bot.addListener('error', function(message) {
    console.log('error: ', message);
});

// wrap irc client's say method
var say = function(message) {
  bot.say(CHANNEL, message);
};

//
// twss
//
twss.threshold = 0.9;
bot.addListener('message', function(from, to, message) {
  if (twss.is(message)) {
    say("that's what she said.");
  }
});

//
// welcome messages.
//
var MSGES = [
  "I missed you.",
  "I was waiting for you.",
  "Back so soon?",
  "Can I get you anything?",
  "How are you feeling today?",
  "Reading to get coding?"
];
var greeting = function() {
  return MSGES[Math.floor(Math.random() * (MSGES.length - 1))];
};
bot.addListener('join##arc3217', function(nick, message) {
  var re = new RegExp(BOT_NICK);
  if (!re.test(nick)) {
    say("Welcome Back: " + nick + ". " + greeting());
  }
});

//
// Filter before sending out git commit messages
//
var parse = function(message) {
  // replace names with IRC nicks and __bold__ nicks
  _.each(NICKS, function(nick, name) {
    message = message.replace(name, nick.irc.bold(), "gi");
  });

  // color branch
  var re = new RegExp("\\(.+?\\)");
  if (re.test(message)) {
    var branch = re.exec(message)[0];
    message = message.replace(branch, branch.irc.red.bold());
  }

  return message;
};

//
// Express Application
//
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 8282);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler());
});

// handle incoming requests
app.post('/', function(req, res) {
  var message = parse(req.body.msg);
  say(message);
  res.send(200);
});

// start application
http.createServer(app).listen(app.get('port'), function(){
  console.log("IRC bot listening on port " + app.get('port'));
});

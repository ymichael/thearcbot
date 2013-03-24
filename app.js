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

app.post('/', function(req, res) {
  console.log(req.body);
  res.send(200);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("IRC bot listening on port " + app.get('port'));
});

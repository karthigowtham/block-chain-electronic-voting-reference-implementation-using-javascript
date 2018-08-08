var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
var nodeNWAddress = new Set();
app.post('/registerNode', function (req, res) {
  var ip = req.ip.split(':')[3];
  var port = req.body.port;
  var nodeAddress = req.body.nodeAddress;
  var nodeUrl = "http://".concat(ip).concat(":").concat(port)

  nodeNWAddress.add(nodeUrl);
  // broadcast the network address to all the clients
  res.json({
    message: "I am registered to network",
    nodeUrl: nodeUrl,
    nodeNWAddress: [...nodeNWAddress]
  })

})

setInterval(() => {
  nodeNWAddress.forEach(networkNode => {
    let reqOption = {
      uri: networkNode + '/register/bulk-nodes',
      method: 'POST',
      body: { networkNodes: [...nodeNWAddress] },
      json: true
    }
    request(reqOption, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body);
    })
  })
}, 10000);


setInterval(() => {
  nodeNWAddress.forEach(networkNode => {
    let reqOption = {
      uri: networkNode + '/register/check',
      method: 'GET',
      json: true
    }
    request(reqOption, function (error, response, body) {
     if(error){
       console.log("removing the node "+networkNode)
      nodeNWAddress.delete(networkNode);
     }
     if(response && response.statusCode===404){
     console.log("removing the node "+networkNode)
      nodeNWAddress.delete(networkNode);
     }
    })
  })
}, 5000);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

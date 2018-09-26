var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const reqPromise = require('request-promise');
const uuid=require('uuid');

var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./src/registration');
var chainDistribution = require('./src/chainDistribution');

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
app.use('/register', register.router);

app.use('/users', users);

setInterval(register.updateNWnodes, 10000)

const blockChain = require('./src/blockchain');
const viCoin = blockChain.SingletonBlockChain.getInstance();

app.get('/blockchain', function (req, res) {
    res.send(viCoin);
});

app.post('/transaction', function (req, res) {
    let transaction = new blockChain.Transactions(
        req.body.sender,
        req.body.recipient,
        req.body.amount,
        uuid().split('-').join(''))
    viCoin.createTransaction(transaction);
    //push to other nodes. transaction
    let requests = chainDistribution.broadCastTransaction(transaction)
    if (requests.length > 0) {
        Promise.all(requests)
            .then(data => {
                res.json(
                    {
                        message: `Creating and broadcasting Transaction successfully!`
                    }
                );
            });
    } else {
        res.json({
            message: `Transaction is added to block with index: ${viCoin.pendingTransactions.length - 1}`
        });
    }
});

app.post('/transaction/broadcast', function (req, res) {
    let transaction = new blockChain.Transactions(
        req.body.sender,
        req.body.recipient,
        req.body.amount,
        req.body.id)
    viCoin.createTransaction(transaction);
    res.json({
        message: `Transaction is added to block with index: ${viCoin.pendingTransactions.length - 1}`
    });
});


app.get('/mine', function (req, res) {
    viCoin.minePendingTransactions(req.params.myaddress);
    let newBlock = viCoin.getLatestBlock();
    res.json({
        message: 'Mining new Block successfully!',
        newBlock
    });
});

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

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;

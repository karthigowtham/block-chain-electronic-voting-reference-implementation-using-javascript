var express = require('express');
var router = express.Router();
const userInstance = require('./users')
const sha256 = require('sha256');

var user = userInstance.getInstance();

const registration = require('../src/API/registration')

/* GET home page. */
router.post('/', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let mngrUrl = req.body.pollMngr;

  user.setUser(sha256(username));
  user.setConnectedUrl(mngrUrl);
  let resp = registration.registerMe(mngrUrl);
  resp
  .then(resp => { res.render('application', { resp: resp, error: '' }); })
  .catch(err => { res.render('application', { error: error, resp: '' }); })
});

router.get('/getUser', function (req, res, next) {
  res.json({
    user: user
  })
});

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  let email=req.body.email;
  let password=req.body.password;
  let mngrUrl=req.body.pollMngr;
  res.render('application', { title: 'Express',email:email,mngrUrl:mngrUrl,authorised:true,scriptValue:'window.user ='+email });
});

module.exports = router;

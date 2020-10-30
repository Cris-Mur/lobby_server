var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    'Welcome to kiwibot API v1' : 'Check documentation on https://app.swaggerhub.com/apis/lobby/kiwi-dash/1.0' 
  });
});

module.exports = router;

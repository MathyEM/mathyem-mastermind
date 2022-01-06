var express = require('express');
var router = express.Router();

/* POST login */
router.post('/login', function(req, res, next) {
  console.log('login attempted')
  console.log(req.body);
});

/* POST register */
router.post('/register', function(req, res, next) {
    console.log('register attempted')
    console.log(req.body);
  });

module.exports = router;
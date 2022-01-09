var express = require('express')
var router = express.Router()
const passport = require('passport')
const User = require("../models/user")
const {userSocket} = require('../utils/socket.io')

/* POST login */
router.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json(info);
    }


    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      userSocket.login(user)
      return res.redirect('/')
    });

  })(req, res, next)
})

/* POST register */
router.post('/register', (req, res, next) => {
  const newUser = new User({ username: req.body.username, email: req.body.email })
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err)
      res.status(409).json({ message: 'some error', error: err })
    }

    passport.authenticate('local')(req, res, function () {
      res.status(201).json({ message: 'Success!' })
    })
  })
})

module.exports = router;


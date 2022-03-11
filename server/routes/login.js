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
      return res.status(400).json(err)
    }

    passport.authenticate('local')(req, res, function () {
      res.sendStatus(200)
    })
  })
})

/* POST logout */
router.post('/logout', (req, res) => {
  req.logout()
  res.sendStatus(200)
})

module.exports = router;


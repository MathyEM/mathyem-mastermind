var express = require('express')
var router = express.Router()
const passport = require('passport')
const User = require("../models/user")

/* POST login */
router.post('/login', (req, res, next) => {
  if (req.body.remember_me) {
    req.session.cookie.originalMaxAge = 30 * 24 * 60 * 60 * 1000 // Expires in 30 days
  } else {
    req.session.cookie.expires = false
  }

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
  const cookie = req.session.cookie
  req.logout()
  res.status(200).clearCookie('session_id', {
    path: cookie.path,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    domain: cookie.domain,
    sameSite: cookie.sameSite,
  })
  req.session.destroy(function () {
    res.redirect('/');
  });
})

module.exports = router;


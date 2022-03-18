const express = require('express'),
      router = express.Router(),
      webpush = require('web-push'),
      User = require('../models/user'),
      mongoStore = require('../models/mongoStore')

router.post('/subscribe', (req, res) => {
  // Get pushSubscription object
  const subscription = req.body.subscription
  console.log(subscription)

  // Send 201 - resource created
  res.status('201').json({})

  // Create payload
  const payload = JSON.stringify({
    title: 'Push Test'
  })

  // Pass object into sendNotification
  webpush.sendNotification(subscription, payload).catch(err => console.error(err))
})

router.post('/validate-session', async (req, res) => {
  const user = await User.findById(req.body.user._id)
  const sessionId = String(req.body.sessionId)

  mongoStore.get(sessionId, (err, session) => {
    if (err || !session || user.username !== session.passport.user) {
      return res.sendStatus(403)
    }
    res.status(200).json({
      sessionValid: true
    })
  })
})

module.exports = router
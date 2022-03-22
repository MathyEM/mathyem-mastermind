const express = require('express'),
      router = express.Router(),
      webpush = require('web-push'),
      mongoStore = require('../models/mongoStore'),
      User = require('../models/user'),
      PushSubscription = require('../models/pushSubscription')

router.post('/subscribe', async (req, res) => {
  // Get user and pushSubscription object
  const userId = req.user.id
  const subscription = req.body.subscription
  const existingEndpoint = await PushSubscription.findOne({ 'subscription.endpoint': subscription.endpoint })
  if (existingEndpoint) {
    return res.status('200').json({})
  }
  const pushSubscription = new PushSubscription()
  pushSubscription.user = userId
  pushSubscription.subscription = subscription
  await pushSubscription.save()

  // Send 201 - resource created
  return res.status('201').json({ pushSubscription })
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
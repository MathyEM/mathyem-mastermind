const express = require('express'),
      router = express.Router(),
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

module.exports = router
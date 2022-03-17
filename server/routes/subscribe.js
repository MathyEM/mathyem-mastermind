const express = require('express'),
      router = express.Router(),
      webpush = require('web-push')

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

module.exports = router
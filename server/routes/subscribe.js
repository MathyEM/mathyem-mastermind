const express = require('express'),
      router = express.Router(),
      pushSubscriptionController = require('../controllers/pushSubscriptionController')

// Subscribe user to push notifications
router.post('/subscribe', pushSubscriptionController.subscribeToPush)

// Unsubscribe user from push notifications
router.post('/unsubscribe', pushSubscriptionController.unsubscribeFromPush)

module.exports = router
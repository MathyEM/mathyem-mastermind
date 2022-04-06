const PushSubscription = require('../models/pushSubscription')

exports.subscribeToPush = async function (req, res) {
  // Get user and pushSubscription object
  const userId = req.user.id
  const subscription = req.body.subscription
  const existingEndpoint = await PushSubscription.findOne({ 'subscription.endpoint': subscription.endpoint })
  if (existingEndpoint && existingEndpoint.user.id.toString('hex') == userId) {
    return res.status('200').json({})
  }
  const pushSubscription = new PushSubscription()
  pushSubscription.user = userId
  pushSubscription.subscription = subscription
  await pushSubscription.save()

  // Send 201 - resource created
  return res.status('201').json({ pushSubscription })
}

exports.unsubscribeFromPush = async function (req, res) {
  console.log('unsubscribe')
  const subscriptionEndpoint = req.body.endpoint
  try {
    const deleted = await PushSubscription.findOneAndDelete({ 'subscription.endpoint': subscriptionEndpoint })
    res.status(204).json({ deleted })
  } catch (error) {
    console.log(error)
    res.status(404).json({})
  }
}
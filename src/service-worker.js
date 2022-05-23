self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

// const API_URL = 'http://localhost:3001'
const API_URL = 'https://api.mastermind.mem-home.tk'
 
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => self.skipWaiting())

console.log("Service Worker Loaded...")

self.addEventListener('activate', async (event) => {
  caches.keys().then(function(names) {
    for (let name of names)
      caches.delete(name);
  })
  const notifications = await self.registration.getNotifications()
  if (notifications.length > 0) {
    notifications.forEach(async notification => {
      await notification.close()
    })
  }

  // Snapshot current state of subscriptions.
  const subscriptions = await self.registration.cookies.getSubscriptions()
  // Clear any existing subscriptions.
  await self.registration.cookies.unsubscribe(subscriptions)
  await self.registration.cookies.subscribe([
    {
      name: 'session_id',  // Subscribe to change events for cookies named session_id.
    }
  ])
  console.log(await self.registration.cookies)
})

self.addEventListener("push", async event => {
  const data = event.data.json()
  console.log(self)
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "https://i.imgur.com/7altDmI.png",
      badge: "https://i.imgur.com/7altDmI.png",
      data: {
        roomId: data.data.roomId,
        test: 'test',
      }
    })
    )
})

self.addEventListener("pushsubscriptionchange", event => {
  console.log('push subscription changed')
  event.waitUntil(self.registration.pushManager.subscribe(event.oldSubscription.options)
    .then(subscription => {
      return postData(API_URL + '/subscribe', {
        subscription,
      })
    })
  )
}, false)

self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(async function(clientList) {
    // console.log('clientList:', clientList)
    // console.log(event.notification)
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]
      if ('focus' in client && 'navigate' in client) {
        return client.navigate('/#/room/' + event.notification.data.roomId)
      }
    }
    if (clients.openWindow)
      return clients.openWindow('/#/room/' + event.notification.data.roomId)
  }))
})

self.addEventListener("cookiechange", async event => {
  console.log(event)
  const subscription = await self.registration.pushManager.getSubscription()
  console.log(subscription)

  if (subscription) {
    // make a copy of the applicationServerKey
    const applicationServerKey = subscription.options.applicationServerKey.slice(0)

    // If the session cookie has been changed or deleted, unsubscribe from push
    if (event.deleted.length > 0 || event.changed.length > 0) {
      const endpoint = subscription.endpoint
      try {
        await postData(API_URL + '/unsubscribe', {
          endpoint: endpoint,
        })
        await subscription.unsubscribe()
      } catch (error) {
        console.log(error)
      }
    }
    
    // if the session cookie was only changed, then make a new subscription
    // - last one should be considered invalidated by the cookie change
    if (event.changed.length > 0) {
      try {
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
        await postData(API_URL + '/subscribe', {
          subscription: newSubscription,
        })
      } catch (error) {
        // if subscription fails on server then unsubscribe
        await newSubscription.unsubscribe()
        console.log(error)
      }
    }
  }
})

async function postData(url = '', data = {}) {
  // Default options are marked with *
  try {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return response // parses JSON response into native JavaScript objects
  
  } catch (error) {
    console.log(error)
  }
}

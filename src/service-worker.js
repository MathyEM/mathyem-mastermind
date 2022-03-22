self.importScripts('localforage.min.js')
workbox.core.setCacheNameDetails({prefix: "vue-pwa-test"});
 
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
 
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => self.skipWaiting())

console.log("Service Worker Loaded...")

self.addEventListener("push", async event => {
  event.waitUntil(
    localforage.ready().then(async () => {
      const user = await localforage.getItem('user')
      const sessionExpiration = await localforage.getItem('sessionExpiration')

      if (!user || !sessionExpiration || (new Date() > new Date(sessionExpiration))) {
        console.log('not valid user or session')
        return
      }
      const data = event.data.json()

      return self.registration.showNotification(data.title, {
        body: data.body,
        icon: "http://image.ibb.co/frYOFd/tmlogo.png",
        vibrate: [200, 100, 200],
      })
    }).catch((err) => { console.log(err) })
  )
})

self.addEventListener("pushsubscriptionchange", event => {
  console.log('push subscription changed')
  event.waitUntil(self.registration.pushManager.subscribe(event.oldSubscription.options)
    .then(subscription => {
      return postData('/subscribe', {
        subscription,
      })
    })
  );
}, false);

async function postData(url = '', data = {}) {
  // Default options are marked with *
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
  return response.json() // parses JSON response into native JavaScript objects
}

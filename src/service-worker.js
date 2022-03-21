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

console.log("Service Worker Loaded...1234")

self.addEventListener("push", async event => {
  event.waitUntil(
    localforage.ready().then(async () => {
      const user = await localforage.getItem('user')
      const sessionId = await localforage.getItem('sessionId')

      return postData('https://api.mastermind.mem-home.tk/validate-session', {user, sessionId})
      .then(sessionValidate => {
        if (sessionValidate.sessionValid) {
          console.log("Push Recieved...")
          const data = event.data.json()

          return self.registration.showNotification(data.title, {
            body: data.body,
            icon: "http://image.ibb.co/frYOFd/tmlogo.png",
            vibrate: [200, 200],
          })
        }
      })
    }).catch((err) => { console.log(err) })
  )
})

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

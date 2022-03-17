self.importScripts('localforage.min.js')
workbox.core.setCacheNameDetails({prefix: "vue-pwa-test"});
 
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
 
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.skipWaiting()

console.log("Service Worker Loaded...")

self.addEventListener("push", async e => {
  await localforage.ready()
  localforage.getItem('user', function (err, user) {
    if (err) {
      console.error(err)
      return
    }
    console.log('local forage user:', user)
  })
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Notified by Traversy Media!",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png"
  });
});
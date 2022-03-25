import { socketConnection } from '@/services/socketio.service.js'
import axios from 'axios'
import ConfigProvider from '@/ConfigProvider'
socketConnection; axios;

const socketEndpoint = ConfigProvider.value('socketEndpoint')
const socketEndpointProtocol = ConfigProvider.value('socketEndpointProtocol')
const publicVapidKey = ConfigProvider.value('publicVapidKey')

const state = {
  pushSubscription: null,
}

const getters = {
  getPushSubscription: state => state.pushSubscription,
}

const mutations = {
  SET_PUSH_SUBSCRIPTION: (state, payload) => state.pushSubscription = payload,
}

const actions = {
  async setPushSubscription({ commit }) {
    // does the browser support service workers
    if ('navigator' in window === false) {
      console.log('no navigator')
      return
    }
    // get service worker registration
    const reg = await navigator.serviceWorker.getRegistration()

    // does the browser support push notifications
    if ('pushManager' in reg === false) {
      commit('SET_PUSH_SUBSCRIPTION', { empty: true })
      return
    }

    // get push subscription
    const subscription = await reg.pushManager.getSubscription()
    commit('SET_PUSH_SUBSCRIPTION', subscription)
  }, 
  async pushNotificationsInitialize({ dispatch }) {
    if ('serviceWorker' in window.navigator) {
      send(dispatch).catch(err => console.log(err))
    }
  }
}

// Register Push, Send Push
async function send(dispatch) {
  console.log('Registering Push...')
  const registration = await window.navigator.serviceWorker.getRegistration()
  const applicationServerKey = urlBase64ToUint8Array(publicVapidKey)
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  await dispatch('setPushSubscription')
  console.log('Push Registered...')

  // Send Push Notification
  axios.post(socketEndpointProtocol + socketEndpoint + '/subscribe',
  {
    subscription,
  }, { withCredentials: true })
  .catch(async (error) => {
    // if subscription fails on server, then unsubscribe
    await subscription.unsubscribe()
    await dispatch('setPushSubscription')
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  })
  .then((response) => {
    if (response) {
      console.log(response)
    }
  })
  console.log('Push Sent...');
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default {
    state,
    getters,
    mutations,
    actions
}
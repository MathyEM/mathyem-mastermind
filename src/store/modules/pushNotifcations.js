import { socketConnection } from '@/services/socketio.service.js'
import axios from 'axios'
import ConfigProvider from '@/ConfigProvider'
socketConnection; axios;

const socketEndpoint = ConfigProvider.value('socketEndpoint')
const socketEndpointProtocol = ConfigProvider.value('socketEndpointProtocol')
const publicVapidKey = ConfigProvider.value('publicVapidKey')

const state = {
  serviceWorkerRegister: {},
}

const getters = {
  getServiceWorkerRegister: state => state.serviceWorkerRegister,
}

const mutations = {
  SET_SERVICE_WORKER_REGISTER(state, payload) {
    state.serviceWorkerRegister = payload
  }
}

const actions = {
  async pushNotificationsInitialize({ getters, rootGetters }) {
    if ('serviceWorker' in navigator) {
      send().catch(err => console.error(err))
    }
    // Register Push, Send Push
    async function send() {
      console.log('Registering Push...')
      const register = getters.getServiceWorkerRegister
      console.log(register)
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
      console.log('Push Registered...')

      // Send Push Notification
      console.log('Sending Push...')
      axios.post(socketEndpointProtocol + socketEndpoint + '/subscribe',
      {
        subscription,
        userId: rootGetters.getUserId,
      }, { withCredentials: true })
      .catch((error) => {
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
  }
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
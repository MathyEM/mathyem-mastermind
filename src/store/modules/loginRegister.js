import axios from 'axios'
import ConfigProvider from '@/ConfigProvider'

const socketEndpoint = ConfigProvider.value('socketEndpoint')
const socketEndpointProtocol = ConfigProvider.value('socketEndpointProtocol')

const state = {
  username: {
    value: '',
    minLength: 3,
    maxLength: 16,
    regex: /^[a-zA-Z0-9._-]+$/i,
  },
  email: {
    value: '',
  },
  password: {
    value: '',
    minLength: 8,
    maxLength: 48,
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[._-])[0-9a-zA-Z._-]+$/,
  },
  rememberMe: false,
  incorrectUsernameOrPasswordState: false,
  errors: {
    generic: {
      required: {
        DA: 'Dette felt er obligatorisk',
        EN: 'This field is required',
      },
      incorrectUsernameOrPassword: {
        DA: 'Forkert brugernavn eller kodeord',
        EN: 'Incorrect username or password'
      }
    },
    username: {
      minmaxLength: {
        DA: 'Dit brugernavn skal være 3-16 tegn langt',
        EN: 'Your username must be 3-16 characters long',
      },
      regex: {
        DA: 'Dit brugernavn må kun indeholde alfanumeriske tegn (A-Z, a-z og 0-9) og <strong>. - _</strong>',
        EN: `Your username can only contain alphanumeric characters (A-Z, a-z and 0-9) and <strong>. - _</strong>`,
      }
    },
    email: {
      email: {
        DA: 'Brug venligst en gyldig mailadresse',
        EN: 'Please use a valid email address',
      }
    },
    password: {
      minmaxLength: {
        DA: 'Dit kodeord skal være mellem 8-48 tegn langt',
        EN: 'Your password must be 8-48 characters long',
      },
      regex: {
        DA: 'Dit kodeord <strong>skal</strong> indeholde mindst ét lille og ét stort bogstav, ét tal og ét specialtegn (</strong>. - _</strong>)',
        EN: `Your password <strong>must</strong> contain at least one lowercase, one uppercase letter, one number and one special character (<strong>. - _</strong>)`,
      }
    }
  }
}
const getters = {
  getLocalUsername: state => state.username.value,
  getUsernameMinLength: state => state.username.minLength,
  getUsernameMaxLength: state => state.username.maxLength,
  getUsernameRegex: state => state.username.regex,
  getLocalEmail: state => state.email.value,
  getLocalPassword: state => state.password.value,
  getPasswordMinLength: state => state.password.minLength,
  getPasswordMaxLength: state => state.password.maxLength,
  getPasswordRegex: state => state.password.regex,
  getRememberMe: state => state.rememberMe,
  getIncorrectUsernameOrPasswordState: state => state.incorrectUsernameOrPasswordState,
  getErrors: state => state.errors,
}
const mutations = {
  UPDATE_LOCAL_USERNAME(state, payload) {
    state.username.value = payload
  },
  UPDATE_LOCAL_EMAIL(state, payload) {
    state.email.value = payload
  },
  UPDATE_LOCAL_PASSWORD(state, payload) {
    state.password.value = payload
  },
  UPDATE_REMEMBER_ME(state, payload) {
    state.rememberMe = payload
  },
  UPDATE_INCORRECT_USERNAME_OR_PASSWORD_STATE(state, payload) {
    state.incorrectUsernameOrPasswordState = payload
  },
}
const actions = {
  loginUser({ getters, commit, dispatch }) {
    if (!getters.getLocalUsername || !getters.getLocalPassword) {
      return
    }
    axios.post(socketEndpointProtocol + socketEndpoint + '/login',
    {
      username: getters.getLocalUsername,
      password: getters.getLocalPassword,
      remember_me: getters.getRememberMe,
    }, { withCredentials: true })
    .then((response) => {
      commit('UPDATE_INCORRECT_USERNAME_OR_PASSWORD_STATE', false)
      console.log(response)
      dispatch('socketLogin', null, { root: true })
    }).catch((err) => {
      commit('UPDATE_INCORRECT_USERNAME_OR_PASSWORD_STATE', true)
      console.log('status: ', err)
    })
  },
  registerUser({ getters }, payload) {
    if (payload.invalid) {
      console.log('form invalid')
      // return
    }
    const currentUrl = window.location.pathname
    axios.post(socketEndpointProtocol + socketEndpoint + '/register',
    {
      username: getters.getLocalUsername,
      email: getters.getLocalEmail,
      password: getters.getLocalPassword,
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
        if (response.status == 200) {
          window.location = currentUrl
        }
      }
    })
  },
  logoutUser() {
    const currentUrl = window.location.pathname
    axios.post(socketEndpointProtocol + socketEndpoint + '/logout', {}, { withCredentials: true })
    .then((response) => {
      if (response.status !== 200) {
        console.log('status: ', response.status);
        return
      }
      window.location = currentUrl
    })
  }
}

export default {
    state,
    getters,
    mutations,
    actions
}
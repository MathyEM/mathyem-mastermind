const state = {
  createJoinRoomErrors: {
      alreadyInRoom: {
          DA: 'Dette rum er fyldt, eller du allerede tilsluttet det',
          EN: "This room is full or you have already joined it"
      }
  },
  alreadyInRoomError: false,
}

const getters = {
  getCreateJoinRoomErrors: state => state.createJoinRoomErrors,
  getAlreadyInRoomError: state => state.alreadyInRoomError,
  getCreateJoinRoomAnyError: state => {
    if (state.alreadyInRoomError) {
      return true
    }
  },
}

const mutations = {
  TOGGLE_ALREADY_IN_ROOM_ERROR(state, payload) {
    state.alreadyInRoomError = payload
    if (payload) {
      state.createJoinRoomAnyError = payload
    }
  },
  TOGGLE_CREATE_JOIN_ROOM_ANY_ERROR(state, payload) {
    state.createJoinRoomAnyError = payload
  }
}

const actions = {
  backToHome() {
    location.reload()
  },
}

export default {
    state,
    getters,
    mutations,
    actions
}
const state = {
  roomName: '',
  createRoomValidation: {
    minLength: 3,
    maxLength: 24,
  },
  createJoinRoomErrors: {
      alreadyInRoom: {
          DA: 'Dette rum er fyldt, eller du har allerede tilsluttet det',
          EN: "This room is full or you already joined it"
      },
      minMax: {
        DA: "<strong>Opret rum:</strong> Navnet på dit rum skal være mellem 3-24 tegn langt.<br><strong>Tilslut rum:</strong> Tilslutningskoder skal være 24 tegn lange.",
        EN: "<strong>Create room:</strong> Your room name must be betweeen 3-24 characters long.<br><strong>Join room:</strong> Join codes must be 24 characters long.",
      }
  },
  alreadyInRoomError: false,
}

const getters = {
  getRoomName: state => state.roomName,
  getCreateRoomMinLength: state => state.createRoomValidation.minLength,
  getCreateRoomMaxLength: state => state.createRoomValidation.maxLength,
  getCreateJoinRoomErrors: state => state.createJoinRoomErrors,
  getAlreadyInRoomError: state => state.alreadyInRoomError,
  getCreateJoinRoomAnyError: state => {
    if (state.alreadyInRoomError) {
      return true
    }
  },
}

const mutations = {
  UPDATE_ROOM_NAME(state, payload) {
    state.roomName = payload
  },
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
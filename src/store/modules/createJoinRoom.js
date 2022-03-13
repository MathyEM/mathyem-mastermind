const state = {
  roomName: '',
  createRoomValidation: {
    minLength: 3,
    maxLength: 24,
  },
  createJoinRoomErrors: {
      alreadyInRoom: {
        DA: 'Dette rum er fyldt, eller du har allerede tilsluttet det.',
        EN: "This room is full or you already joined it."
      },
      minMax: {
        DA: "<strong>Opret rum:</strong> Navnet på dit rum skal være mellem 3-24 tegn langt.<br><strong>Tilslut rum:</strong> Tilslutningskoder skal være 24 tegn lange.",
        EN: "<strong>Create room:</strong> Your room name must be betweeen 3-24 characters long.<br><strong>Join room:</strong> Join codes must be 24 characters long.",
      },
      invalidJoinCode: {
        DA: 'Ugyldig tilslutningskode.',
        EN: "Invalid join code.",
      },
      invalidJoinCodeLength: {
        DA: 'En tilslutningskode skal være 24 tegn',
        EN: "A join code must be 24 characters",
      },
  },
  alreadyInRoomErrorStatus: false,
  invalidJoinCodeErrorStatus: false,
  invalidJoinCodeLengthErrorStatus: false,
  
}

const getters = {
  getRoomName: state => state.roomName,
  getCreateRoomMinLength: state => state.createRoomValidation.minLength,
  getCreateRoomMaxLength: state => state.createRoomValidation.maxLength,
  getCreateJoinRoomErrors: state => state.createJoinRoomErrors,
  getAlreadyInRoomErrorStatus: state => state.alreadyInRoomErrorStatus,
  getInvalidJoinCodeErrorStatus: state => state.invalidJoinCodeErrorStatus,
  getInvalidJoinCodeLengthErrorStatus: state => state.invalidJoinCodeLengthErrorStatus,
  getCreateJoinRoomAnyErrorStatus: state => {
    if (state.alreadyInRoomErrorStatus) {
      return true
    }
    if (state.invalidJoinCodeErrorStatus) {
      return true
    }
    if (state.invalidJoinCodeLengthErrorStatus) {
      return true
    }
    return false
  },
}

const mutations = {
  UPDATE_ROOM_NAME(state, payload) {
    state.roomName = payload
  },
  TOGGLE_ALREADY_IN_ROOM_ERROR_STATUS(state, payload) {
    state.alreadyInRoomErrorStatus = payload
    if (payload) {
      state.createJoinRoomAnyErrorStatus = payload
    }
  },
  TOGGLE_INVALID_JOIN_CODE_ERROR_STATUS(state, payload) {
    state.invalidJoinCodeErrorStatus = payload
    if (payload) {
      state.createJoinRoomAnyErrorStatus = payload
    }
  },
  TOGGLE_INVALID_JOIN_CODE_LENGTH_ERROR_STATUS(state, payload) {
    state.invalidJoinCodeLengthErrorStatus = payload
    console.log("TOGGLE_INVALID_JOIN_CODE_LENGTH_ERROR_STATUS called");
    if (payload) {
      state.createJoinRoomAnyErrorStatus = payload
    }
  },
  TOGGLE_CREATE_JOIN_ROOM_ANY_ERROR(state, payload) {
    state.createJoinRoomAnyErrorStatus = payload
    state.alreadyInRoomErrorStatus = payload
    state.invalidJoinCodeErrorStatus = payload
    state.invalidJoinCodeLengthErrorStatus = payload
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
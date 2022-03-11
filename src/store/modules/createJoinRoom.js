const state = {
  createJoinRoomStatus: {
      alreadyInRoom: {
          DA: 'Dette rum er fyldt, eller du allerede tilsluttet det',
          EN: "This room is full or you have already joined it"
      }
  },
  createJoinRoomError: false,
}

const getters = {
  getCreateJoinRoomStatus: (state) => {
    state
  },
  getCreateJoinRoomError: state => state.createJoinRoomError,

}

const mutations = {

}

const actions = {

}

export default {
    state,
    getters,
    mutations,
    actions
}
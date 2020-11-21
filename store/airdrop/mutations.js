import { SET_AIRDROP, SET_NOTIFICATION } from './constant'

export default {
  [SET_AIRDROP](state, airdrops) {
    this._vm.$set(state, 'airdrops', airdrops)
  },
  [SET_NOTIFICATION](state, index) {
    this._vm.$set(state, 'notificationIndex', index)
  },
}

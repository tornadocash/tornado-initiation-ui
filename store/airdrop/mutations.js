import { SET_AIRDROP } from './constant'

export default {
  [SET_AIRDROP](state, airdrops) {
    this._vm.$set(state, 'airdrops', airdrops)
  },
}

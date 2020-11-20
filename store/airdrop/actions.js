import { localStorage } from '@/utillites'

import { SET_AIRDROP } from './constant'

export default {
  setAirdropAddresses({ getters, commit }) {
    const savedActions = localStorage.getItem('actions')

    if (savedActions) {
      commit(SET_AIRDROP, savedActions)
      return
    }

    const actions = getters.selectAirdropData

    localStorage.setItem('actions', actions)
    commit(SET_AIRDROP, actions)
  },
}

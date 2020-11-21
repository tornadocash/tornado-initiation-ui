import { localStorage } from '@/utillites'

import { SET_AIRDROP, SET_NOTIFICATION } from './constant'

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
  checkAddress({ rootGetters, commit, dispatch, state }) {
    const address = rootGetters['provider/getAccount']

    const callback = () => {
      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: document.getElementById('current').getBoundingClientRect().top,
      })
    }

    state.airdrops.forEach((item, index) => {
      item.forEach((i) => {
        if (i.address === address) {
          commit(SET_NOTIFICATION, index)

          dispatch(
            'notice/addNotice',
            {
              notice: {
                type: 'success',
                title: 'You have airdrop',
                callback,
              },
            },
            { root: true }
          )
        }
      })
    })
  },
}

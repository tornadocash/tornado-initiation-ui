export const state = () => {
  return {
    message: '',
    enabled: false,
    txHash: null,
  }
}

export const getters = {}

export const mutations = {
  ENABLE(state, { message, txHash }) {
    state.message = message
    state.txHash = txHash
    state.enabled = true
  },
  DISABLE(state) {
    state.message = ''
    state.txHash = null
    state.enabled = false
  },
}

export const actions = {
  enable({ commit }, { message = this.app.i18n.t('loading'), txHash }) {
    commit('ENABLE', { message, txHash })
  },
  changeText({ commit }, { message }) {
    commit('ENABLE', { message })
  },
  disable({ commit }) {
    commit('DISABLE')
  },
}

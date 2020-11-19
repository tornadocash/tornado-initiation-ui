const NOTICE_INTERVAL = 10000

export const state = () => {
  return {
    notices: [],
    timers: {},
  }
}

export const mutations = {
  ADD_NOTICE(state, notice) {
    state.notices.push(notice)
  },
  UPDATE_NOTICE(state, { index, notice }) {
    this._vm.$set(state.notices, index, notice)
  },
  DELETE_NOTICE(state, index) {
    this._vm.$delete(state.notices, index)
  },
  ADD_NOTICE_TIMER(state, { id, timerId }) {
    this._vm.$set(state.timers, id, { timerId })
  },
  DELETE_NOTICE_TIMER(state, id) {
    this._vm.$delete(state.timers, id)
  },
}

export const actions = {
  addNotice({ commit }, { notice }) {
    return new Promise((resolve) => {
      const id = `f${(+new Date()).toString(16)}`
      commit('ADD_NOTICE', { ...notice, id })
      resolve(id)
    })
  },
  addNoticeTimer({ commit, dispatch }, { id, interval = NOTICE_INTERVAL }) {
    const timerId = setTimeout(() => {
      dispatch('deleteNotice', { id })
    }, interval)
    commit('ADD_NOTICE_TIMER', { id, timerId })
  },
  deleteNoticeTimer({ state, commit }, { id }) {
    if (state.timers[id]) {
      clearTimeout(state.timers[id].timerId)
      commit('DELETE_NOTICE_TIMER', id)
    }
  },
  addNoticeWithInterval({ dispatch }, { notice, interval }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const id = await dispatch('addNotice', { notice })
      dispatch('addNoticeTimer', { id, interval })
      resolve(id)
    })
  },
  deleteNotice({ state, commit, dispatch }, { id }) {
    const index = state.notices.findIndex((i) => {
      return i.id === id
    })
    commit('DELETE_NOTICE', index)
    dispatch('deleteNoticeTimer', { id })
  },
  updateNotice({ state, commit, dispatch }, { id, notice, interval }) {
    const { notices } = state
    const index = notices.findIndex((i) => {
      return i.id === id
    })
    commit('UPDATE_NOTICE', {
      index,
      notice: {
        ...notices[index],
        ...notice,
      },
    })
    if (interval) {
      dispatch('deleteNoticeTimer', { id })
      dispatch('addNoticeTimer', { id, interval })
    }
  },
}

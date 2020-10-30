/* eslint-disable no-console */
import txStatus from './txStatus'
const { hexToNumber } = require('web3-utils')

export const state = () => ({
  approveTx: {
    txHash: '',
    status: txStatus.nonExistent,
  },
  vipTx: {
    txHash: '',
    status: txStatus.nonExistent,
  },
  topUpTx: {
    txHash: '',
    status: txStatus.nonExistent,
  },
  multisendTxs: {}, // { txHash: status }
  createAirdropTx: {
    txHash: '',
    status: txStatus.nonExistent,
  },
  claimAirdropTx: {
    txHash: '',
    status: txStatus.nonExistent,
  },
  leftOversTx: {
    txHash: '',
    status: txStatus.nonExistent,
  },
})

export const getters = {
  txExplorerUrl: (state, getters, rootState, rootGetters) => (
    txName,
    txHash
  ) => {
    const { explorerUrl } = rootGetters['metamask/networkConfig']
    if (txName === 'multisendTxs') {
      return explorerUrl.tx + txHash
    }
    return explorerUrl.tx + state[txName].txHash
  },
  txHashToRender: (state) => (txName, txHash) => {
    const hash = txHash || state[txName].txHash
    return hash.slice(0, 20) + '...' + hash.slice(-20)
  },
  txStatusClass: (state) => (status) => {
    let cssClass
    switch (status) {
      case txStatus.waitingForReciept:
        cssClass = 'is-loading'
        break
      case txStatus.success:
        cssClass = 'is-success'
        break
      case txStatus.fail:
        cssClass = 'is-danger'
        break
      default:
        break
    }
    return cssClass
  },
}

export const mutations = {
  SAVE_TX_HASH(state, { txName, txHash }) {
    this._vm.$set(state[txName], 'txHash', txHash)
    this._vm.$set(state[txName], 'status', txStatus.waitingForReciept)
  },
  CHANGE_TX_STATUS(state, { txName, status }) {
    this._vm.$set(state[txName], 'status', status)
  },
}

export const actions = {
  async runTxWatcher({ commit, dispatch }, { txName, txHash }) {
    let { status } = await dispatch(
      'metamask/waitForTxReceipt',
      { txHash },
      { root: true }
    )
    status = hexToNumber(status) === 1 ? txStatus.success : txStatus.fail
    commit('CHANGE_TX_STATUS', { txName, status })
    return status === txStatus.success
  },
}

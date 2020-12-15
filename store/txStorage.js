/* eslint-disable no-console */
import txStatus from './txStatus'
const { hexToNumber } = require('web3-utils')

export const getters = {
  txExplorerUrl: (state, getters, rootState, rootGetters) => (txHash) => {
    const { explorerUrl } = rootGetters['provider/getNetwork']
    return explorerUrl.tx + txHash
  },
}

export const actions = {
  async runTxWatcher({ commit, dispatch }, { txHash }) {
    const result = await dispatch(
      'provider/waitForTxReceipt',
      { txHash },
      { root: true }
    )

    if (!result || !result.status) {
      return false
    }

    const status =
      hexToNumber(result.status) === 1 ? txStatus.success : txStatus.fail

    return status === txStatus.success
  },
}

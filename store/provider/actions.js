import networkConfig from '@/networkConfig'
import { localStorage } from '@/utillites'
import {
  SET_ACCOUNT,
  SET_NETWORK,
  CLEAR_STATE,
  SET_BALANCE,
  SET_NETWORK_NAME,
  SET_PROVIDER_NAME,
} from './constant'

export default {
  async initProvider({ commit, state, getters, dispatch }, { name, network }) {
    try {
      commit(SET_PROVIDER_NAME, name)
      commit(SET_NETWORK_NAME, network)

      localStorage.setItem('provider', { name, network })

      const account = await this.$provider.initProvider(getters.getProvider)
      const netId = await dispatch('checkNetworkVersion')

      this.$provider.initWeb3(networkConfig[`netId${netId}`].rpcUrls.Infura.url)

      commit(SET_ACCOUNT, account)

      await dispatch('getBalance', account)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async checkNetworkVersion({ commit, state, dispatch }) {
    try {
      const id = await this.$provider.checkNetworkVersion()
      commit(SET_NETWORK, { ...networkConfig[`netId${id}`], id: Number(id) })
      return id
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async sendRequest(_, params) {
    try {
      return await this.$provider.sendRequest(params)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async contractRequest(_, params) {
    try {
      return await this.$provider.contractRequest(params)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async getBalance({ dispatch, commit, getters }, account) {
    try {
      const balance = await this.$provider.getBalance({ address: account })

      commit(SET_BALANCE, balance)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  clearState({ commit }) {
    try {
      localStorage.removeItem('provider')
      commit(CLEAR_STATE)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async waitForTxReceipt({ dispatch, getters }, { txHash }) {
    try {
      const tx = await this.$provider.waitForTxReceipt({ txHash })

      return tx
    } catch (err) {
      throw new Error(err.message)
    }
  },
}

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
      const account = await this.$provider.initProvider(getters.getProvider)
      if (window.ethereum.chainId !== '0x89') {
        await dispatch(
          'notice/addNotice',
          {
            notice: {
              title: 'polygonOnly',
              type: 'danger',
              callback: () => dispatch('addNetwork', { netId: 137 }),
              message: 'switchNetwork',
            },
          },
          { root: true }
        )
        throw new Error('Connect to Polygon')
      }

      commit(SET_PROVIDER_NAME, name)
      commit(SET_NETWORK_NAME, network)

      localStorage.setItem('provider', { name, network })

      const netId = await dispatch('checkNetworkVersion')

      this.$provider.initWeb3(networkConfig[`netId${netId}`].rpcUrls.Infura.url)

      commit(SET_ACCOUNT, account)

      await dispatch('getBalance', account)
      dispatch('airdrop/checkAddress', {}, { root: true })
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
  async addNetwork(_, { netId }) {
    const METAMASK_LIST = {
      137: {
        chainId: '0x89',
        chainName: 'Matic Mainnet',
        rpcUrls: ['https://rpc-mainnet.matic.network'],
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://explorer.matic.network'],
      },
    }

    if (METAMASK_LIST[netId]) {
      await this.$provider.sendRequest({
        method: 'wallet_addEthereumChain',
        params: [METAMASK_LIST[netId]],
      })
    }
  },
}

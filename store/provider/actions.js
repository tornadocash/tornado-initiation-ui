import networkConfig from '@/networkConfig'
import { localStorage } from '@/utillites'
import { numberToHex } from 'web3-utils'
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
      if (window.ethereum.chainId !== '0x64') {
        await dispatch(
          'notice/addNotice',
          {
            notice: {
              title: 'xDaiOnly',
              type: 'danger',
              callback: () => dispatch('switchNetwork', { netId: 100 }),
              message: 'switchNetwork',
            },
          },
          { root: true }
        )
        throw new Error('Connect to xDai')
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
  async switchNetwork({ dispatch }, { netId }) {
    try {
      await this.$provider.sendRequest({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: numberToHex(netId) }],
      })
    } catch (err) {
      // This error indicates that the chain has not been added to MetaMask.
      if (err.message.includes('wallet_addEthereumChain')) {
        return dispatch('addNetwork', { netId })
      }

      throw new Error(err.message)
    }
  },
  async addNetwork(_, { netId }) {
    const METAMASK_LIST = {
      100: {
        chainId: '0x64',
        chainName: 'xDAI Chain',
        rpcUrls: ['https://rpc.xdaichain.com'],
        nativeCurrency: {
          name: 'xDAI',
          symbol: 'xDAI',
          decimals: 18,
        },
        blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
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

import Web3 from 'web3'
import { toChecksumAddress, hexToNumberString } from 'web3-utils'

import networkConfig from '@/networkConfig'
import {
  SET_ACCOUNT,
  SET_BALANCE,
  SET_NETWORK,
  SET_PROVIDER_API,
  SET_NETWORK_NAME,
  SET_PROVIDER_NAME,
} from './constant'

const repeatUntilResult = (action, totalAttempts, retryAttempt = 1) =>
  new Promise((resolve, reject) => {
    const iteration = async () => {
      const result = await action()

      if (!result) {
        if (retryAttempt <= totalAttempts) {
          retryAttempt++
          setTimeout(iteration, 1000)
        } else {
          return reject(new Error('tx not minted'))
        }
      } else {
        resolve(result)
      }
    }

    iteration()
  })

export default {
  async initProvider({ commit, state, dispatch }, { name, network } = {}) {
    try {
      commit(SET_PROVIDER_NAME, name)
      commit(SET_NETWORK_NAME, network)

      await dispatch('_checkVersion')
      await dispatch('_initProvider')

      await dispatch('getBalance', state.account)
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async sendRequest({ commit, dispatch, getters, state }, params) {
    const provider = getters.getProvider

    try {
      const request = (version, args) =>
        version === 'old'
          ? dispatch('_sendAsync', args)
          : provider.request(args)

      const result = await request(state.provider.version, params)

      return result
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async contractRequest(
    { dispatch, getters },
    { methodName, data, to, from, gas, value = 0 }
  ) {
    const { rpcCallRetryAttempt, rpcUrl, blockGasLimit } = getters.getNetwork

    try {
      const web3 = new Web3(rpcUrl)
      const params = {
        data,
        to,
        from,
        value,
        gas: gas || blockGasLimit + 100000,
      }

      const transaction = await repeatUntilResult(
        () => web3.eth[methodName](params),
        rpcCallRetryAttempt
      )

      return transaction
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async checkNetworkVersion({ commit, dispatch }) {
    try {
      const id = await dispatch('sendRequest', { method: 'net_version' })
      commit(SET_NETWORK, { ...networkConfig[`netId${id}`], id: Number(id) })

      window.localStorage.setItem(
        'network',
        networkConfig[`netId${id}`].networkName
      )
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async getBalance({ dispatch, commit, getters }, account) {
    const { rpcCallRetryAttempt } = getters.getNetwork

    try {
      const params = {
        method: 'eth_getBalance',
        params: [account, 'latest'],
      }

      const balance = await repeatUntilResult(
        () => dispatch('sendRequest', params),
        rpcCallRetryAttempt
      )

      commit(SET_BALANCE, hexToNumberString(balance))
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async waitForTxReceipt({ dispatch, getters }, { txHash }) {
    const { rpcCallRetryAttempt } = getters.getNetwork

    try {
      const params = {
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      }

      const tx = await repeatUntilResult(
        () => dispatch('sendRequest', params),
        rpcCallRetryAttempt
      )

      return tx
    } catch (err) {
      throw new Error(err.message)
    }
  },
  _sendAsync({ getters }, { method, params, from }) {
    const provider = getters.getProvider
    const { id } = getters.getNetwork

    switch (id) {
      case 77:
      case 99:
      case 100:
        from = undefined
        break
    }

    return new Promise((resolve, reject) => {
      provider.sendAsync(
        {
          method,
          params,
          jsonrpc: '2.0',
          from,
        },
        (err, response) => {
          if (err) {
            reject(err)
          }
          if (response.error) {
            reject(response.error)
          } else {
            resolve(response.result)
          }
        }
      )
    })
  },
  async _initProvider({ commit, state, dispatch, getters }) {
    const provider = getters.getProvider

    try {
      const request = (version) =>
        version === 'old'
          ? provider.enable()
          : dispatch('sendRequest', { method: 'eth_requestAccounts' })

      const [account] = await request(state.provider.version)

      if (!account) {
        throw new Error('Locked metamask')
      }

      provider.on('accountsChanged', (accounts) =>
        dispatch('_onAccountsChanged', accounts)
      )
      provider.on('chainChanged', (id) => dispatch('_onNetworkChanged', { id }))

      commit(SET_ACCOUNT, toChecksumAddress(account))

      await dispatch('checkNetworkVersion')
    } catch (err) {
      throw new Error(err.message)
    }
  },
  _onNetworkChanged({ commit }, { id }) {
    commit(SET_NETWORK, { ...networkConfig[`netId${id}`], id: Number(id) })
  },
  _onAccountsChanged({ newAccount, commit }, accounts) {
    const [account] = accounts
    commit(SET_ACCOUNT, toChecksumAddress(account))

    window.location.reload()
  },
  _checkVersion({ getters, commit }) {
    const provider = getters.getProvider

    if (provider && provider.request) {
      commit(SET_PROVIDER_API, 'new')
    } else {
      commit(SET_PROVIDER_API, 'old')
    }
  },
}

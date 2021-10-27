/* eslint-disable no-console */
import networkConfig from '@/networkConfig'
import { GasPriceOracle } from 'gas-price-oracle'
import { estimateFees } from '@mycrypto/gas-estimation'
const { toHex, toWei } = require('web3-utils')

export const state = () => {
  return {
    params: {
      1: {
        maxFeePerGas: '0x25FF7A6000',
        maxPriorityFeePerGas: '0x77359400',
      },
    },
    prices: {
      1: Object.assign(networkConfig.netId1.gasPrices),
      100: Object.assign(networkConfig.netId100.gasPrices),
    },
  }
}

export const getters = {
  oracle: (state, getters, rootState, rootGetters) => {
    const { id: chainId, gasPrices } = rootGetters['provider/getNetwork']
    const currentRpc = rootGetters['provider/getRpc']

    console.log('currentRpc', currentRpc)
    return new GasPriceOracle({
      chainId,
      defaultRpc: currentRpc,
      defaultFallbackGasPrices: gasPrices,
    })
  },
  gasParams: (state) => (chainId) => {
    return state.params[chainId]
  },
  gasPrice: (state) => (chainId) => {
    const currentGas = state.prices[chainId]
    return toHex(toWei(currentGas.fast.toString(), 'gwei'))
  },
  txGasParams: (state, getters, rootState, rootGetters) => {
    const { id: chainId, isEip1559Supported } = rootGetters[
      'provider/getNetwork'
    ]
    if (isEip1559Supported) {
      return getters.gasParams(chainId)
    }
    return { gasPrice: getters.gasPrice(chainId) }
  },
}

export const mutations = {
  SAVE_GAS_PRICES(state, { chainId, ...gas }) {
    this._vm.$set(state.prices, chainId, gas)
  },
  SET_GAS_PARAMS(state, { chainId, ...params }) {
    this._vm.$set(state.params, chainId, params)
  },
}

export const actions = {
  async fetchGasParams({ getters, commit, dispatch, rootGetters, state }) {
    const { pollInterval, id: chainId, isEip1559Supported } = rootGetters[
      'provider/getNetwork'
    ]
    const rpcUrl = rootGetters['provider/getRpc']
    try {
      if (isEip1559Supported) {
        const web3 = this.$provider.getWeb3(rpcUrl)
        const { maxFeePerGas, maxPriorityFeePerGas } = await estimateFees(web3)

        commit('SET_GAS_PARAMS', {
          maxFeePerGas: toHex(maxFeePerGas.toString()),
          maxPriorityFeePerGas: toHex(maxPriorityFeePerGas.toString()),
          chainId,
        })
      } else {
        const gas = await getters.oracle.gasPrices()
        commit('SAVE_GAS_PRICES', { chainId, ...gas })
        console.log(`Got fast gas price ${gas.fast}`)
      }

      setTimeout(() => dispatch('fetchGasParams'), 1000 * pollInterval)
    } catch (e) {
      console.error('fetchGasParams', e)
      setTimeout(() => dispatch('fetchGasParams'), 1000 * pollInterval)
    }
  },
}

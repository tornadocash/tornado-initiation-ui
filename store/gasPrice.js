/* eslint-disable no-console */
import networkConfig from '@/networkConfig'
import { GasPriceOracle } from 'gas-price-oracle'
import { estimateFees } from '@mycrypto/gas-estimation'
const { toHex, toWei } = require('web3-utils')

export const state = () => {
  return {
    params: {
      maxFeePerGas: '0x25FF7A6000',
      maxPriorityFeePerGas: '0x77359400',
    },
    prices: Object.assign(networkConfig.netId1.gasPrices),
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
  isEip1559Supported: (state, getters, rootState, rootGetters) => {
    const { isEip1559Supported } = rootGetters['provider/getNetwork']
    return isEip1559Supported
  },
  gasPrice: (state, getters) => {
    if (getters.isEip1559Supported) {
      return state.params.maxFeePerGas
    }

    return toHex(toWei(state.prices.fast.toString(), 'gwei'))
  },
  txGasParams: (state, getters) => (isDisable = false) => {
    if (!isDisable && getters.isEip1559Supported) {
      return state.params
    }
    return { gasPrice: getters.gasPrice }
  },
}

export const mutations = {
  SAVE_GAS_PRICES(state, gas) {
    this._vm.$set(state, 'prices', gas)
  },
  SET_GAS_PARAMS(state, params) {
    this._vm.$set(state, 'params', params)
  },
}

export const actions = {
  async fetchGasParams({ getters, commit, dispatch, rootGetters, state }) {
    const { pollInterval, isEip1559Supported } = rootGetters[
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
        })
      } else {
        const gas = await getters.oracle.gasPrices()
        commit('SAVE_GAS_PRICES', gas)
        console.log(`Got fast gas price ${gas.fast}`)
      }

      setTimeout(() => dispatch('fetchGasParams'), 1000 * pollInterval)
    } catch (e) {
      console.error('fetchGasParams', e)
      setTimeout(() => dispatch('fetchGasParams'), 1000 * pollInterval)
    }
  },
}

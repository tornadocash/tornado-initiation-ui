import Web3 from 'web3'

import networkConfig from '@/networkConfig'

export default {
  getProvider: (state, getters) => {
    switch (getters.getProviderName) {
      case 'metamask':
      case 'trustwallet':
      case 'genericWeb3':
      default:
        if (window.ethereum) {
          return window.ethereum
        } else {
          throw new Error(
            `${getters.getProviderName} does not have ethereum property`
          )
        }
    }
  },
  getProviderName: ({ provider }) => {
    return provider.name
  },
  getWeb3: (state, getters) => {
    const provider = getters.getProvider

    return Object.freeze(new Web3(provider))
  },
  getBalance: (state) => {
    return state.balance
  },
  getNetwork: (state) => {
    const id = state.network.id
    return { ...networkConfig[`netId${id}`], id: Number(id) }
  },
  getAccount: (state) => {
    return state.account
  },
}

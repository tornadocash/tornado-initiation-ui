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
  getRpc: (state, getters) => {
    return getters.getNetwork.rpcUrls.Infura.url
  },
}

const networkConfig = {
  netId43114: {
    rpcCallRetryAttempt: 15,
    gasPrices: { fast: 225, low: 225, custom: 225, standard: 225 },
    currencyName: 'AVAX',
    explorerUrl: {
      tx: 'https://cchain.explorer.avax.network/tx/',
      address: 'https://cchain.explorer.avax.network/address/',
    },
    networkName: 'avalanche',
    rpcUrls: {
      Infura: {
        name: 'Avalanche RPC',
        url: 'https://api.avax.network/ext/bc/C/rpc',
      },
    },
    pollInterval: 200,
  },
}

export default networkConfig

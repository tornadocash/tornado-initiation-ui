const networkConfig = {
  netId42161: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 4,
      fast: 3,
      standard: 2.52,
      low: 2.29,
    },
    currencyName: 'ETH',
    explorerUrl: {
      tx: 'https://arbiscan.io/tx/',
      address: 'https://arbiscan.io/address/',
    },
    networkName: 'arbitrum',
    rpcUrls: {
      Infura: {
        name: 'Arbitrum Public RPC',
        url:
          'https://arb-mainnet.g.alchemy.com/v2/_82R9fXSpgWH9iv_oKdwKww7qMyJ6OpR',
      },
    },
    pollInterval: 15,
  },
}

export default networkConfig

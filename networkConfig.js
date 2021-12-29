const networkConfig = {
  netId10: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 4,
      fast: 3,
      standard: 2.52,
      low: 2.29,
    },
    currencyName: 'ETH',
    explorerUrl: {
      tx: 'https://optimistic.etherscan.io/tx/',
      address: 'https://optimistic.etherscan.io/address/',
    },
    networkName: 'optimism',
    rpcUrls: {
      Infura: {
        name: 'Optimism RPC',
        url:
          'https://opt-mainnet.g.alchemy.com/v2/6gdxilsHZ0gV2da6mV7grCHRrZAa0jms',
      },
    },
    pollInterval: 15,
  },
}

export default networkConfig

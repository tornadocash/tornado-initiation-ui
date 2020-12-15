const networkConfig = {
  netId1: {
    rpcCallRetryAttempt: 15,
    gasPrices: { instant: 80, fast: 50, standard: 25, low: 8 },
    currencyName: 'ETH',
    explorerUrl: {
      tx: 'https://etherscan.io/tx/',
      address: 'https://etherscan.io/address/',
    },
    networkName: 'Mainnet',
    rpcUrls: {
      Infura: {
        name: 'Infura',
        url: 'https://mainnet.infura.io/v3/2884a3281c1d4ae8952e25c84d76bced',
      },
      MyCrypto: { name: 'MyCrypto', url: 'https://api.mycryptoapi.com/eth' },
    },
    pollInterval: 60,
  },
  netId5: {
    rpcCallRetryAttempt: 15,
    gasPrices: { instant: 80, fast: 50, standard: 25, low: 8 },
    currencyName: 'gETH',
    explorerUrl: {
      tx: 'https://goerli.etherscan.io/tx/',
      address: 'https://goerli.etherscan.io/address/',
    },
    networkName: 'goerli',
    rpcUrls: {
      Infura: {
        name: 'Infura',
        url: 'https://goerli.infura.io/v3/2884a3281c1d4ae8952e25c84d76bced',
      },
    },
    pollInterval: 200,
  },
}

export default networkConfig

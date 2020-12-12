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
        url: 'https://mainnet.infura.io/v3/da564f81919d40c9a3bcaee4ff44438d',
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
        url: 'https://goerli.infura.io/v3/da564f81919d40c9a3bcaee4ff44438d',
      },
    },
    pollInterval: 200,
  },
}

export default networkConfig

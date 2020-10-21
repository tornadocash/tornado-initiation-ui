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
    deployerContract: '0xce0042b868300000d44a59004da54a005ffdcf9f',
    pollInterval: 60,
  },
  netId42: {
    rpcCallRetryAttempt: 15,
    gasPrices: { instant: 80, fast: 50, standard: 25, low: 8 },
    currencyName: 'kETH',
    explorerUrl: {
      tx: 'https://kovan.etherscan.io/tx/',
      address: 'https://kovan.etherscan.io/address/',
    },
    networkName: 'Kovan',
    deployerContract: '0xce0042b868300000d44a59004da54a005ffdcf9f',
    rpcUrls: {
      Infura: {
        name: 'Infura',
        url: 'https://kovan.infura.io/v3/9b8f0ddb3e684ece890f594bf1710c88',
      },
      'POA.network': { name: 'POA.network', url: 'https://kovan.poa.network' },
    },
    pollInterval: 200,
  },
}

export default networkConfig

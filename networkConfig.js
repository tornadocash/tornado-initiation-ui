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
    isL1: true,
    isEip1559Supported: true,
  },

  netId100: {
    rpcCallRetryAttempt: 15,
    gasPrices: {
      instant: 5,
      fast: 4,
      standard: 3,
      low: 1,
    },
    currencyName: 'xDAI',
    explorerUrl: {
      tx: 'https://blockscout.com/xdai/mainnet/tx/',
      address: 'https://blockscout.com/xdai/mainnet/address/',
    },
    networkName: 'xdai',
    rpcUrls: {
      Infura: {
        name: 'xDAI Chain RPC',
        url: 'https://rpc.xdaichain.com/tornado',
      },
    },
    pollInterval: 200,
    isL1: false,
    isEip1559Supported: false,
  },
}

export default networkConfig

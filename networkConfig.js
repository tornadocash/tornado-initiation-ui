const networkConfig = {
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
  },
}

export default networkConfig

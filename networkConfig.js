const networkConfig = {
  netId56: {
    rpcCallRetryAttempt: 15,
    gasPrices: { instant: 21, fast: 5, standard: 5, low: 5 },
    currencyName: 'BNB',
    explorerUrl: {
      tx: 'https://bscscan.com/tx/',
      address: 'https://bscscan.com/address/',
    },
    networkName: 'bsc',
    rpcUrls: {
      Infura: {
        name: 'Infura',
        url:
          'https://wandering-sparkling-shadow.bsc.quiknode.pro/00115b17f97c1f4c374ac309858015da1cab3e02/',
      },
    },
    pollInterval: 200,
  },
}

export default networkConfig

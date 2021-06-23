const networkConfig = {
  netId137: {
    rpcCallRetryAttempt: 15,
    gasPrices: { instant: 7.5, fast: 5, standard: 1, low: 1 },
    currencyName: 'MATIC',
    explorerUrl: {
      tx: 'https://polygonscan.com/tx/',
      address: 'https://polygonscan.com/address/',
    },
    networkName: 'polygon',
    rpcUrls: {
      Infura: {
        name: 'Infura',
        url:
          'https://polygon-mainnet.infura.io/v3/da564f81919d40c9a3bcaee4ff44438d',
      },
    },
    pollInterval: 60,
  },
}

export default networkConfig

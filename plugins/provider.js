import networkConfig from '@/networkConfig'
import { Provider } from '../services'

const MAIN_NET_ID = 1
const MAIN_NET_BLOCK_GAS_LIMIT = 7300000

const options = {
  config: {
    id: MAIN_NET_ID,
    rpcCallRetryAttempt: 15,
    rpcUrl: networkConfig.netId1.rpcUrl,
    blockGasLimit: MAIN_NET_BLOCK_GAS_LIMIT,
  },
}

const provider = new Provider(options)

export default (context, inject) => {
  inject('provider', provider)
  context.$provider = provider
}

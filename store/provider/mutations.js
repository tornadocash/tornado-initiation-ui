import {
  SET_ACCOUNT,
  SET_NETWORK,
  SET_BALANCE,
  SET_PROVIDER_API,
  SET_NETWORK_NAME,
  SET_PROVIDER_NAME,
} from './constant'

export default {
  [SET_BALANCE](state, balance) {
    this._vm.$set(state, 'balance', balance)
  },
  [SET_PROVIDER_API](state, version) {
    this._vm.$set(state.provider, 'version', version)
  },
  [SET_PROVIDER_NAME](state, name) {
    this._vm.$set(state.provider, 'name', name)
  },
  [SET_ACCOUNT](state, account) {
    this._vm.$set(state, 'account', account)
  },
  [SET_NETWORK](state, network) {
    this._vm.$set(state, 'network', network)
  },
  [SET_NETWORK_NAME](state, name) {
    this._vm.$set(state.network, 'name', name)
  },
}

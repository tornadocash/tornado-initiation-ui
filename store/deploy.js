/* eslint-disable no-console */
import Web3 from 'web3'
import { numberToHex } from 'web3-utils'
import deployerABI from '../abi/deployer.abi.json'
import deploymentActions from '../static/deploymentActions.json'

const state = () => {
  return {}
}

const getters = {
  deployerContract: (state, getters, rootState, rootGetters) => {
    const { deployerContract, rpcUrls } = rootGetters['provider/getNetwork']
    const web3 = new Web3(rpcUrls.Infura.url)
    return new web3.eth.Contract(deployerABI, deployerContract)
  },
}

const mutations = {}

const actions = {
  async deployContract(
    { state, dispatch, getters, rootGetters, commit, rootState },
    { domain }
  ) {
    try {
      const ethAccount = rootGetters['provider/getAccount']
      const web3 = rootGetters['provider/getWeb3']
      const { salt } = deploymentActions
      const { bytecode, expectedAddress } = deploymentActions.actions.filter(
        (action) => {
          return action.domain === domain
        }
      )[0]

      const code = await web3.eth.getCode(expectedAddress)

      if (code !== '0x') {
        throw new Error('Already deployed')
      }
      const data = getters.deployerContract.methods
        .deploy(bytecode, salt)
        .encodeABI()

      const callParams = {
        method: 'eth_sendTransaction',
        params: [
          {
            from: ethAccount,
            to: getters.deployerContract._address,
            gas: numberToHex(6e6),
            gasPrice: '0x100000000',
            value: 0,
            data,
          },
        ],
        from: ethAccount,
      }
      const txHash = await dispatch('provider/sendRequest', callParams, {
        root: true,
      })
      console.log('txHash', txHash)
    } catch (e) {
      console.error('deployContract', e.message)
    }
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

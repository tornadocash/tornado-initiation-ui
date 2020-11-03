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
      dispatch('loading/enable', {}, { root: true })
      const ethAccount = rootGetters['provider/getAccount']
      const web3 = rootGetters['provider/getWeb3']
      const { salt } = deploymentActions
      const { bytecode, expectedAddress } = deploymentActions.actions.filter(
        (action) => {
          return action.domain === domain
        }
      )[0]

      const code = await web3.eth.getCode(expectedAddress)
      console.log('code', code)
      if (code !== '0x') {
        dispatch(
          'notice/addNoticeWithInterval',
          {
            notice: {
              title: 'alreadyDeployed',
              type: 'danger',
            },
          },
          { root: true }
        )
        throw new Error('Already deployed')
      }

      const gasPrice = rootGetters['gasPrice/fastGasPrice']

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
            gasPrice,
            value: 0,
            data,
          },
        ],
        from: ethAccount,
      }
      dispatch(
        'loading/changeText',
        {
          message: this.app.i18n.t('pleaseConfirmTransactionInWallet', {
            wallet: rootGetters['provider/getProviderName'],
          }),
        },
        { root: true }
      )
      const txHash = await dispatch('provider/sendRequest', callParams, {
        root: true,
      })
      console.log('txHash', txHash)
      dispatch('loading/disable', {}, { root: true })

      const noticeId = await dispatch(
        'notice/addNotice',
        {
          notice: {
            title: 'sendingTransaction',
            txHash,
            type: 'loading',
          },
        },
        { root: true }
      )

      const success = await dispatch(
        'txStorage/runTxWatcher',
        { txHash },
        { root: true }
      )

      if (success) {
        dispatch(
          'notice/updateNotice',
          {
            id: noticeId,
            notice: {
              title: 'contractDeployed',
              type: 'success',
            },
            interval: true,
          },
          { root: true }
        )
        dispatch('steps/fetchDeploymentStatus', {}, { root: true })
      } else {
        dispatch(
          'notice/updateNotice',
          {
            id: noticeId,
            notice: {
              title: 'transactionFailed',
              type: 'danger',
            },
            interval: true,
          },
          { root: true }
        )
      }
    } catch (e) {
      console.error('deployContract', e.message)
    } finally {
      dispatch('loading/disable', {}, { root: true })
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

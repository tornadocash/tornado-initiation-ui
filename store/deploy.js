/* eslint-disable no-console */
import Web3 from 'web3'
import { hexToNumber, numberToHex } from 'web3-utils'
import deployerABI from '../abi/deployer.abi.json'
import deploymentActions from '../static/deploymentActions.json'

const deployerContracts = [
  'deployer.contract.tornadocash.eth',
  'deployerL1.contract.tornadocash.eth',
  'deployerL2.contract.tornadocash.eth',
]

const state = () => {
  return {}
}

const getters = {
  deployerContract: (state, getters, rootState, rootGetters) => (isProxy) => {
    const web3 = new Web3(rootGetters['provider/getRpc'])
    return new web3.eth.Contract(
      deployerABI,
      isProxy
        ? deploymentActions.deployer
        : deploymentActions.actions[0].expectedAddress
    )
  },
}

const mutations = {}

const actions = {
  async deployContract(
    { state, dispatch, getters, rootGetters, commit, rootState },
    { action, index, isL1 }
  ) {
    try {
      dispatch('loading/enable', {}, { root: true })
      const web3 = this.$provider.getWeb3(rootGetters['provider/getRpc'])
      const code = await web3.eth.getCode(action.expectedAddress)
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

      const ethAccount = rootGetters['provider/getAccount']
      const txGasParams = rootGetters['gasPrice/txGasParams']

      console.log(txGasParams)

      const isProxy = deployerContracts.includes(action.domain)
      const deployerContract = getters.deployerContract(isProxy)

      const data = deployerContract.methods
        .deploy(action.bytecode, deploymentActions.salt)
        .encodeABI()
      const params = {
        from: ethAccount,
        to: deployerContract._address,
        ...txGasParams,
        value: '0x0',
        data,
      }

      const gasEstimate = isProxy
        ? numberToHex(363636)
        : await dispatch(
            'provider/sendRequest',
            { method: 'eth_estimateGas', params: [params] },
            { root: true }
          )

      const gasWithBuffer = Math.ceil(hexToNumber(gasEstimate) * 1.1)

      dispatch(
        'loading/changeText',
        {
          message: this.app.i18n.t('pleaseConfirmTransactionInWallet', {
            wallet: rootGetters['provider/getProviderName'],
          }),
        },
        { root: true }
      )
      const txHash = await dispatch(
        'provider/sendRequest',
        {
          method: 'eth_sendTransaction',
          params: [
            {
              ...params,
              gas: numberToHex(gasWithBuffer),
            },
          ],
        },
        {
          root: true,
        }
      )
      console.log('txHash', txHash)
      dispatch('loading/disable', {}, { root: true })
      dispatch(
        'steps/setPendingState',
        { status: true, stepIndex: index, isL1 },
        { root: true }
      )

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
            interval: 20000,
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
            interval: 20000,
          },
          { root: true }
        )
      }
    } catch (e) {
      console.error('deployContract', e.message)
      await dispatch(
        'notice/addNotice',
        {
          notice: {
            title: 'cannotBeExecuted',
            type: 'danger',
          },
        },
        { root: true }
      )
    } finally {
      dispatch('loading/disable', {}, { root: true })
      dispatch(
        'steps/setPendingState',
        { status: false, stepIndex: index, isL1 },
        { root: true }
      )
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

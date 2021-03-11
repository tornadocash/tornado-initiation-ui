/* eslint-disable no-console */
import { hexToNumber, numberToHex } from 'web3-utils'
import deployerABI from '../abi/deployer.abi.json'
import deploymentActions from '../static/deploymentActions.json'

const state = () => {
  return {}
}

const getters = {
  deployerContract: (state, getters, rootState, rootGetters) => () => {
    const web3 = rootGetters['provider/currentRpc']
    return new web3.eth.Contract(deployerABI, deploymentActions.deployer)
  },
}

const mutations = {}

const actions = {
  async deployContract(
    { state, dispatch, getters, rootGetters, commit, rootState },
    { action, index }
  ) {
    try {
      dispatch('loading/enable', {}, { root: true })
      const isProxy = action.domain === 'deployer.contract.tornadocash.eth'
      const ethAccount = rootGetters['provider/getAccount']
      const web3 = rootGetters['provider/currentRpc']

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

      const gasPrice = rootGetters['gasPrice/fastGasPrice']

      const data = getters
        .deployerContract()
        .methods.deploy(action.bytecode, deploymentActions.salt)
        .encodeABI()
      const callParamsEstimate = {
        method: 'eth_estimateGas',
        params: [
          {
            from: ethAccount,
            to: getters.deployerContract()._address,
            // gas: numberToHex(6e6),
            gasPrice,
            value: `0x0`,
            data,
          },
        ],
        from: ethAccount,
      }
      const gasEstimate =
        action.domain === 'deployer.contract.tornadocash.eth'
          ? numberToHex(1e6)
          : await dispatch('provider/sendRequest', callParamsEstimate, {
              root: true,
            })
      const gasWithBuffer = Math.ceil(hexToNumber(gasEstimate) * 1.1)
      const callParams = {
        method: 'eth_sendTransaction',
        params: [
          {
            from: ethAccount,
            to: getters.deployerContract()._address,
            gas: numberToHex(gasWithBuffer),
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
      dispatch(
        'steps/setPendingState',
        { status: true, stepIndex: index },
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
        { status: false, stepIndex: index },
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

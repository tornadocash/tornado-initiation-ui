/* eslint-disable no-console */
import deploymentActions from '../static/deploymentActions.json'

const l1Steps = deploymentActions.actions.filter(
  ({ isL1Contract }) => isL1Contract
)
const l2Steps = deploymentActions.actions.filter(
  ({ isL1Contract }) => !isL1Contract
)

const state = () => {
  return {
    l1Steps,
    l2Steps,
  }
}

const getters = {
  deployedL1Count: (state, getters) => {
    return getters.deployedCount(true)
  },
  deployedL2Count: (state, getters) => {
    return getters.deployedCount(false)
  },
  steps: (state) => (isL1) => {
    return isL1 ? state.l1Steps : state.l2Steps
  },
  deployedCount: (state, getters) => (isL1) => {
    const steps = getters.steps(isL1)
    const deployed = steps.filter((step) => !!step.deployerAddress).length
    const all = steps.length
    return `${deployed}/${all}`
  },
  canDeploy: (state, getters) => (domain, isL1) => {
    const steps = getters.steps(isL1)
    const { dependsOn } = steps.find((s) => s.domain === domain)
    return dependsOn.every((d) => {
      return Boolean(steps.find((s) => s.domain === d)?.deployerAddress)
    })
  },
}

const SET_DEPLOYER = 'SET_DEPLOYER'
const SET_PENDING_STATE = 'SET_PENDING_STATE'
const mutations = {
  [SET_DEPLOYER](
    state,
    { stepIndex, deployerAddress, deployTransaction, isL1 }
  ) {
    const steps = isL1 ? 'l1Steps' : 'l2Steps'
    this._vm.$set(state[steps][stepIndex], 'deployerAddress', deployerAddress)
    this._vm.$set(
      state[steps][stepIndex],
      'deployTransaction',
      deployTransaction
    )
  },
  [SET_PENDING_STATE](state, { status, stepIndex, isL1 }) {
    const steps = isL1 ? 'l1Steps' : 'l2Steps'
    this._vm.$set(state[steps][stepIndex], 'isPending', status)
  },
}

const actions = {
  async fetchDeploymentStatus({
    state,
    getters,
    dispatch,
    commit,
    rootGetters,
  }) {
    const { isL1 } = rootGetters['provider/getNetwork']
    const steps = getters.steps(isL1)
    const deployContract = rootGetters['deploy/deployerContract'](false)
    const events = await deployContract.getPastEvents('Deployed', {
      fromBlock: 0,
      toBlock: 'latest',
    })

    for (const event of events) {
      const step = steps.find(
        (s) => s.expectedAddress === event.returnValues.addr
      )

      if (!step) {
        continue
      }
      commit(SET_DEPLOYER, {
        stepIndex: steps.indexOf(step),
        deployerAddress: event.returnValues.sender,
        deployTransaction: event.transactionHash,
        isL1,
      })
    }
  },
  statusPooling({ dispatch }) {
    setTimeout(async () => {
      try {
        console.log('Fetching deployment status...')
        await dispatch('fetchDeploymentStatus')
      } finally {
        dispatch('statusPooling')
      }
    }, 15000)
  },
  setPendingState({ commit }, payload) {
    commit(SET_PENDING_STATE, payload)
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

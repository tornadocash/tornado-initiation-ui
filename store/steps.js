/* eslint-disable no-console */
import deploymentActions from '../static/deploymentActions.json'

const state = () => {
  return {
    steps: deploymentActions.actions,
  }
}

const getters = {
  deployedCount: (state) => {
    const deployed = state.steps.filter((step) => !!step.deployerAddress).length
    const all = state.steps.length
    return `${deployed}/${all}`
  },
  canDeploy: (state) => (domain) => {
    const { dependsOn } = state.steps.find((s) => s.domain === domain)
    return dependsOn.every(
      (d) => !!state.steps.find((s) => s.domain === d).deployerAddress
    )
  },
}

const SET_DEPLOYER = 'SET_DEPLOYER'
const SET_PENDING_STATE = 'SET_PENDING_STATE'
const mutations = {
  [SET_DEPLOYER](state, { stepIndex, deployerAddress, deployTransaction }) {
    this._vm.$set(state.steps[stepIndex], 'deployerAddress', deployerAddress)
    this._vm.$set(
      state.steps[stepIndex],
      'deployTransaction',
      deployTransaction
    )
  },
  [SET_PENDING_STATE](state, { status, stepIndex }) {
    this._vm.$set(state.steps[stepIndex], 'isPending', status)
  },
}

const actions = {
  async fetchDeploymentStatus({ state, dispatch, commit, rootGetters }) {
    const deployContract = rootGetters['deploy/deployerContract'](false)
    const events = await deployContract.getPastEvents('Deployed', {
      fromBlock: 0,
      toBlock: 'latest',
    })

    for (const event of events) {
      const step = state.steps.find(
        (s) => s.expectedAddress === event.returnValues.addr
      )

      if (!step) {
        continue
      }
      commit(SET_DEPLOYER, {
        stepIndex: state.steps.indexOf(step),
        deployerAddress: event.returnValues.sender,
        deployTransaction: event.transactionHash,
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
  setPendingState({ commit }, { status, stepIndex }) {
    commit(SET_PENDING_STATE, { status, stepIndex })
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

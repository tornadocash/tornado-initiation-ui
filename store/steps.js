/* eslint-disable no-console */
import Web3 from 'web3'
import deploymentActions from '../static/deploymentActions.json'

const state = () => {
  return {
    steps: [
      {
        title: 'TORN token',
        domain: 'torn.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Governance Implementation',
        domain: 'governanceImpl.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Governance Upgradable Proxy',
        domain: 'gov.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Anonymity mining: Verifier (1/3)',
        domain: 'reward.verifier.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Anonymity mining: Verifier (2/3)',
        domain: 'withdraw.verifier.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Anonymity mining: Verifier (3/3)',
        domain: 'treeUpdate.verifier.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Anonymity mining: Swap contract for private points',
        domain: 'swap.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Anonymity mining: TornadoTrees contract',
        domain: 'tornadoTrees.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Anonymity mining: Miner contract',
        domain: 'miningV2.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Airdrop contract',
        domain: 'voucher.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Team vestings (1/5)',
        domain: 'team1.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Team vestings (2/5)',
        domain: 'team2.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Team vestings (3/5)',
        domain: 'team2.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Team vestings (4/5)',
        domain: 'team2.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        title: 'Team vestings (5/5)',
        domain: 'team2.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
      },
      {
        domain: 'mining.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
        title: 'Vesting for the future anonymity mining (V3 release)',
      },
      {
        domain: 'gov.vesting.deploy.tornadocash.eth',
        deployerAddress: null,
        title: 'Vesting for the governance itself',
      },
    ],
  }
}

const getters = {
  deployedCount: (state) => {
    const deployed = state.steps.filter((step) => {
      return !!step.deployerAddress
    }).length
    const all = state.steps.length
    return `${deployed}/${all}`
  },
}

const SET_DEPLOYER = 'SET_DEPLOYER'
const mutations = {
  [SET_DEPLOYER](state, { stepIndex, deployerAddress }) {
    this._vm.$set(state.steps[stepIndex], 'deployerAddress', deployerAddress)
  },
}

const actions = {
  async fetchDeploymentStatus({ state, dispatch, commit, rootGetters }) {
    const { rpcUrls } = rootGetters['provider/getNetwork']
    const web3 = new Web3(rpcUrls.Infura.url)

    try {
      for (const [stepIndex, step] of state.steps.entries()) {
        const { expectedAddress } = deploymentActions.actions.find((action) => {
          return action.domain === step.domain
        })

        const code = await web3.eth.getCode(expectedAddress)

        if (code !== '0x') {
          // todo collect deployerAddress from chain
          commit(SET_DEPLOYER, {
            stepIndex,
            deployerAddress: '0x03Ebd0748Aa4D1457cF479cce56309641e0a98F5',
          })
        }
      }
    } catch (e) {
      console.error('fetchDeploymentStatus', e.message)
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

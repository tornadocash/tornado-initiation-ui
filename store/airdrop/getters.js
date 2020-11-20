import { fromWei } from 'web3-utils'

import deploymentActions from '~/static/deploymentActions.json'

export default {
  getAirdrops: (state) => {
    return state.airdrops
  },
  selectAirdropsActions: () => {
    return deploymentActions.actions.filter(
      (action) => action.contract === 'Airdrop.sol'
    )
  },
  selectAirdropData: (state, getters) => {
    const actions = getters.selectAirdropsActions

    return actions.map((action) => {
      const data = action.bytecode.split(state.secretCode)[1]

      // eslint-disable-next-line no-unused-vars
      const [_, ...addressInfo] = data.match(/.{128}/g)

      return addressInfo.map((info) => {
        return {
          address: `0x${info.slice(24, 64)}`,
          value: fromWei(info.slice(64, 128)),
        }
      })
    })
  },
}

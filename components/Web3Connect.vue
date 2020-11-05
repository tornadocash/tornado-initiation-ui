<template>
  <div class="modal-card box box-modal">
    <header class="box-modal-header is-spaced">
      <div class="box-modal-title">{{ $t('yourWallet') }}</div>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <div class="note">
      {{ $t('pleaseSelectYourWeb3Wallet') }}
    </div>
    <div
      class="field is-grouped is-grouped-centered is-grouped-multiline wallets"
    >
      <!-- <div v-show="isGeneric" class="control">
        <button
          class="button is-small is-black is-generic"
          @click="_web3Connect('generic')"
        >
          {{ $t('otherWallet') }}
        </button>
      </div> -->
      <div class="control">
        <b-tooltip
          :label="$t('pleaseInstallMetamask')"
          position="is-top"
          :active="!isMetamask"
          multilined
        >
          <button
            :disabled="!isMetamask"
            class="button is-small is-black is-metamask"
            @click="_web3Connect('metamask')"
          >
            Metamask
          </button>
        </b-tooltip>
      </div>
      <div v-show="isTrust" class="control">
        <button
          class="button is-small is-black is-trustwallet"
          @click="_web3Connect('trustwallet')"
        >
          Trust Wallet
        </button>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-console */

export default {
  computed: {
    isMetamask() {
      return window.web3 && window.web3.currentProvider.isMetaMask
    },
    // isGeneric() {
    //   return (
    //     !this.isMetamask && !this.isTrust && (window.web3 || window.ethereum)
    //   )
    // },
    isTrust() {
      return window.web3 && window.web3.currentProvider.isTrust
    },
  },
  methods: {
    async _web3Connect(name, network) {
      this.$store.dispatch('loading/enable', {})
      try {
        await this.$store.dispatch(
          'provider/initProvider',
          { name, network },
          { root: true }
        )
        this.$store.dispatch('steps/fetchDeploymentStatus', {})
      } catch (e) {
        console.error(e)
      }
      this.$store.dispatch('loading/disable')
      this.$parent.close()
    },
  },
}
</script>

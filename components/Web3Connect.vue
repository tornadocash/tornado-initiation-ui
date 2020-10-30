<template>
  <div class="modal-card box box-modal is-wallet-modal">
    <div class="title">{{ $t('yourWallet') }}</div>
    <div class="note">
      {{ $t('pleaseSelectYourWeb3Wallet') }}
    </div>
    <div
      class="field is-grouped is-grouped-centered is-grouped-multiline wallets"
    >
      <div class="control">
        <button
          v-show="isGeneric"
          class="button is-small is-black is-generic"
          @click="_web3Connect('generic')"
        >
          {{ $t('otherWallet') }}
        </button>
        <button
          v-show="isMetamask"
          class="button is-small is-black is-metamask"
          @click="_web3Connect('metamask')"
        >
          Metamask
        </button>
        <button
          v-show="isTrust"
          class="button is-small is-black is-trustwallet"
          @click="_web3Connect('trustwallet')"
        >
          Trust Wallet
        </button>
        <button
          v-show="isImToken"
          class="button is-small is-black is-imtoken"
          @click="_web3Connect('imtoken')"
        >
          imToken
        </button>
        <button
          v-show="isAlphaWallet"
          class="button is-small is-black is-alphawallet"
          @click="_web3Connect('alphawallet')"
        >
          AlphaWallet
        </button>
      </div>
      <div class="control control-with-select">
        <button
          class="button is-small is-black is-portis"
          @click="_web3Connect('portis', portisNetwork)"
        >
          Portis
        </button>
        <NetworkSelect v-model="portisNetwork" />
      </div>
      <div class="control control-with-select">
        <button
          class="button is-small is-black is-squarelink"
          @click="_web3Connect('squarelink', squarelinkNetwork)"
        >
          Squarelink
        </button>
        <NetworkSelect v-model="squarelinkNetwork" />
      </div>
      <div class="control control-with-select">
        <button
          class="button is-small is-black is-fortmatic"
          @click="_web3Connect('fortmatic', fortmaticNetwork)"
        >
          Fortmatic
        </button>
        <NetworkSelect v-model="fortmaticNetwork" />
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-console */
import NetworkSelect from '@/components/NetworkSelect'

export default {
  components: {
    NetworkSelect,
  },
  data() {
    return {
      isBackuped: false,
      portisNetwork: 'mainnet',
      squarelinkNetwork: 'mainnet',
      fortmaticNetwork: 'mainnet',
    }
  },
  computed: {
    isMetamask() {
      return window.web3 && window.web3.currentProvider.isMetaMask
    },
    isGeneric() {
      return (
        !this.isMetamask &&
        !this.isTrust &&
        !this.isImToken &&
        !this.isAlphaWallet &&
        (window.web3 || window.ethereum)
      )
    },
    isTrust() {
      return window.web3 && window.web3.currentProvider.isTrust
    },
    isImToken() {
      return window.ethereum && window.ethereum.isImToken
    },
    isAlphaWallet() {
      return window.web3 && window.web3.currentProvider.isAlphaWallet
    },
  },
  methods: {
    async _web3Connect(name, network) {
      this.$store.dispatch('loading/enable', {})
      try {
        await this.$store.dispatch('metamask/initialize', {
          providerName: name,
          networkName: network,
        })
      } catch (e) {
        console.error(e)
      }
      this.$store.dispatch('loading/disable')
      this.$parent.close()
    },
  },
}
</script>

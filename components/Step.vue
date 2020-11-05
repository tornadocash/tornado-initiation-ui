<template>
  <div class="step">
    <diamond
      :active="!!data.deployerAddress"
      :waiting="!canDeploy(data.domain)"
    />
    <div class="step-body">
      <h4>{{ data.title }}</h4>
      <h5 v-if="data.domain" class="deployed">
        ENS:
        <a :href="domainUrl(data.expectedAddress)" target="_blank">{{
          data.domain
        }}</a>
      </h5>
      <i18n
        v-if="data.deployerAddress"
        class="deployed"
        tag="h6"
        path="deployedBy"
      >
        <template v-slot:link>
          <a :href="txHash(data.deployTransaction)" target="_blank">{{
            data.deployerAddress
          }}</a>
        </template>
      </i18n>
    </div>
    <div class="step-tail">
      <div v-if="data.deployerAddress" class="completed">
        <b-icon icon="check" />
        <span>{{ $t('completed') }}</span>
      </div>
      <b-tooltip
        v-else
        :label="
          isNotLoggedIn
            ? $t('pleaseConnectWallet')
            : !canDeploy(data.domain)
            ? $t('dependsOnEns', { ens: data.dependsOn.join(', ') })
            : ''
        "
        position="is-top"
        multilined
        :size="isNotLoggedIn ? 'is-small' : 'is-large'"
        :active="isNotLoggedIn || !canDeploy(data.domain)"
        append-to-body
      >
        <b-button
          type="is-primary"
          outlined
          icon-left="tool"
          :disabled="isNotLoggedIn || !canDeploy(data.domain)"
          @mousedown="(e) => e.preventDefault()"
          @click="onDeploy"
        >
          {{ $t('deploy') }}
        </b-button>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Diamond from '@/components/Diamond'

export default {
  components: {
    Diamond,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('provider', ['getProviderName']),
    ...mapGetters('steps', ['canDeploy']),
    isNotLoggedIn() {
      return !this.getProviderName
    },
  },
  methods: {
    ...mapActions('deploy', ['deployContract']),
    // todo pass ens domain here
    onDeploy(/* domain */) {
      // console.log('this.props', this.data)
      this.deployContract({ action: this.data })
    },
    domainUrl(address) {
      return `https://etherscan.io/address/${address}`
    },
    txHash(txHash) {
      return `https://etherscan.io/tx/${txHash}`
    },
  },
}
</script>

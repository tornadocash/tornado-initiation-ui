<template>
  <div class="step">
    <div class="step-container">
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
      <div class="step-more-button">
        <b-button size="is-small" @click="isExpanded = !isExpanded">{{
          isExpanded ? 'Less' : 'More'
        }}</b-button>
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
        >
          <b-button
            type="is-primary"
            outlined
            icon-left="tool"
            :disabled="
              isNotLoggedIn || !canDeploy(data.domain) || data.isPending
            "
            @mousedown="(e) => e.preventDefault()"
            @click="onDeploy"
          >
            {{ $t('deploy') }}
          </b-button>
        </b-tooltip>
      </div>
    </div>
    <transition-expand>
      <div v-show="isExpanded" class="step-more">
        <p v-show="!data.airdrops">
          {{ data.description }}
        </p>
        <div
          class="columns is-multiline mt-3 is-gapless is-justify-content-space-around"
        >
          <div
            v-for="(airdrop, index) in data.airdrops"
            :key="index"
            style="flex: none"
            class="column"
          >
            <div class="p-3">
              Address:
              <a :href="domainUrl(airdrop.address)" target="_blank">
                {{ airdrop.address }}
              </a>
              <br />
              <span>Value: {{ airdrop.value }} vTORN</span>
            </div>
          </div>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Diamond from '@/components/Diamond'
import TransitionExpand from '@/components/TransitionExpand'

export default {
  components: {
    Diamond,
    TransitionExpand,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    }
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
    onDeploy() {
      this.deployContract({ action: this.data, index: this.$vnode.key })
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

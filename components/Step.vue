<template>
  <div :id="data.isActive ? 'current' : ''" class="step">
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
            <a :href="txExplorerUrl(data.deployTransaction)" target="_blank">{{
              data.deployerAddress
            }}</a>
          </template>
        </i18n>
      </div>
      <div class="step-more-button">
        <b-button
          size="is-small"
          :class="data.isActive ? 'button--active' : ''"
          @click="isExpanded = !isExpanded"
          >{{ isExpanded ? 'Less' : 'More' }}</b-button
        >
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
        <b-table
          v-show="data.airdrops"
          :data="data.airdrops"
          :sticky-header="true"
          :row-class="(row) => row.address === getAccount && 'is-selected'"
        >
          <b-table-column v-slot="props" field="address" label="Address">
            <a :href="domainUrl(props.row.address)" target="_blank">{{
              props.row.address
            }}</a>
          </b-table-column>
          <b-table-column v-slot="props" field="value" label="Value">
            {{ Number(props.row.value).toFixed(4) }} vTORN
          </b-table-column>
        </b-table>
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
    ...mapGetters('provider', ['getProviderName', 'getAccount']),
    ...mapGetters('steps', ['canDeploy']),
    ...mapGetters('txStorage', ['txExplorerUrl']),
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
  },
}
</script>

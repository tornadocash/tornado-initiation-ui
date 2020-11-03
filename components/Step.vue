<template>
  <div class="step">
    <diamond :active="!!data.deployerAddress" />
    <div class="step-body">
      <h4>{{ data.title }}</h4>
      <i18n
        v-if="data.deployerAddress"
        class="deployed"
        tag="div"
        path="deployedBy"
      >
        <template v-slot:link>
          <a href="#">{{ data.deployerAddress }}</a>
        </template>
      </i18n>
    </div>
    <div class="step-tail">
      <div v-if="data.deployerAddress" class="completed">
        <b-icon icon="check" />
        <span>{{ $t('completed') }}</span>
      </div>
      <b-button
        v-else
        type="is-primary"
        outlined
        icon-left="tool"
        :disabled="isNotLoggedIn"
        @mousedown="(e) => e.preventDefault()"
        @click="onDeploy"
      >
        {{ $t('deploy') }}
      </b-button>
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
    isNotLoggedIn() {
      return !this.getProviderName
    },
  },
  methods: {
    ...mapActions('deploy', ['deployContract']),
    // todo pass ens domain here
    onDeploy(/* domain */) {
      // console.log('this.props', this.data)
      this.deployContract({ domain: this.data.domain })
    },
  },
}
</script>

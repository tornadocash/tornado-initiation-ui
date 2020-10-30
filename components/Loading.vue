<template>
  <b-loading :active.sync="enabled">
    <div class="loading-container">
      <div class="loading-tornado"></div>
      <div class="loading-message">{{ message }}...</div>
      <b-button v-if="txHash" tag="a" type="is-primary" :href="txExplorerUrl(txHash)" target="_blank">
        {{ $t('viewInExplorer') }}
      </b-button>
    </div>
  </b-loading>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('txHashKeeper', ['txExplorerUrl']),
    ...mapState('loading', ['enabled', 'message', 'txHash']),
    ...mapState('metamask', ['providerName'])
  }
}
</script>

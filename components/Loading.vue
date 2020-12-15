<template>
  <b-loading :active.sync="enabled">
    <div class="loading-container">
      <div class="loading-tornado"></div>
      <div class="loading-message">{{ message }}...</div>
    </div>
  </b-loading>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('loading', ['enabled', 'message', 'txHash']),
    ...mapState('getNetwork', ['getProviderName']),
  },
}
</script>

<template>
  <div class="notices is-top">
    <b-notification
      v-for="notice in notices"
      :key="notice.id"
      class="is-top-right"
      has-icon
      :icon="notice.type"
      :aria-close-label="$t('closeNotification')"
      role="alert"
      @close="close(notice.id)"
    >
      <i18n :path="notice.title.path || notice.title" tag="span">
        <template v-slot:value>
          <b>{{ notice.title.value }}</b>
        </template>
      </i18n>
      <a
        v-if="typeof notice.callback === 'function'"
        @click="callbackWithClose(notice.id, notice.callback)"
      >
        Scroll to voucher
      </a>
      <a
        v-if="notice.txHash"
        :href="txExplorerUrl(notice.txHash)"
        target="_blank"
      >
        {{ $t('viewOnEtherscan') }}
      </a>
    </b-notification>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState('notice', ['notices']),
    ...mapGetters('txStorage', ['txExplorerUrl']),
  },
  methods: {
    ...mapActions('notice', ['deleteNotice']),
    callbackWithClose(id, callback) {
      callback()
      this.deleteNotice({ id })
    },
    close(id) {
      this.deleteNotice({ id })
    },
  },
}
</script>

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
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('notice', ['notices']),
    ...mapGetters('txHashKeeper', ['txExplorerUrl']),
  },
  methods: {
    ...mapActions('notice', ['deleteNotice']),
    close(id) {
      this.deleteNotice({ id })
    },
  },
}
</script>

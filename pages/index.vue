<template>
  <div>
    <h1 class="title has-text-centered">
      Tornado.cash <span>Nova</span> Deployment
    </h1>
    <h2 class="subtitle has-text-centered">{{ $t('pageSubtitle') }}</h2>

    <div class="buttons is-centered">
      <b-button
        type="is-primary"
        outlined
        icon-left="tool"
        @mousedown="(e) => e.preventDefault()"
        @click="onStart"
        >{{ $t('startNow') }}</b-button
      >
    </div>

    <i18n tag="h3" class="title is-14px mt-6" path="completedTasks">
      <template v-slot:layer>{{ $t(getNetwork.isL1 ? 'l1' : 'l2') }}</template>
      <template v-slot:progress>
        <span>{{ getNetwork.isL1 ? deployedL1Count : deployedL2Count }}</span>
      </template>
    </i18n>
    <div class="tornado-discoverer image is-16by9"></div>

    <steps ref="steps" />
  </div>
</template>

<script>
import Steps from '@/components/Steps'
import { mapGetters } from 'vuex'

export default {
  components: {
    Steps,
  },
  computed: {
    ...mapGetters('steps', ['deployedL1Count', 'deployedL2Count']),
    ...mapGetters('provider', ['getNetwork']),
  },
  methods: {
    scrollTo(element) {
      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top,
      })
    },
    onStart() {
      this.scrollTo(this.$refs.steps.$el)
    },
  },
}
</script>

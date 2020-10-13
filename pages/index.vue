<template>
  <div>
    <h1 class="title has-text-centered">Tornado.cash <span>Ceremony</span></h1>
    <h2 class="subtitle has-text-centered">
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium.
    </h2>

    <div class="buttons is-centered">
      <b-button
        type="is-primary"
        outlined
        icon-left="tool"
        @mousedown="(e) => e.preventDefault()"
        @click="onStart"
        >Start now</b-button
      >
    </div>

    <h3 class="title is-14px mt-6">Completed Tasks: <span>5/16</span></h3>

    <div class="tornado-discoverer image is-16by9"></div>

    <steps ref="steps" />
  </div>
</template>

<script>
import Steps from '@/components/Steps'

export default {
  components: {
    Steps,
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

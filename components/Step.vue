<template>
  <div class="step">
    <diamond :active="!!data.deployAddress" />
    <div class="step-body">
      <h4>{{ data.title }}</h4>
      <div v-if="data.deployAddress" class="deployed">
        Deployed by: <a href="#">{{ data.deployAddress }}</a>
      </div>
    </div>
    <div class="step-tail">
      <div v-if="data.deployAddress" class="completed">
        <b-icon icon="check" />
        <span>Completed</span>
      </div>
      <b-button v-else type="is-primary" outlined icon-left="tool">
        Deploy
      </b-button>
    </div>
  </div>
</template>

<script>
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
}
</script>
<template>
  <div class="steps">
    <step v-for="(step, index) in steps" :key="index" :data="step" />
  </div>
</template>

<script>
import Step from '@/components/Step'
import { mapState } from 'vuex'

export default {
  components: {
    Step,
  },
  computed: {
    ...mapState('steps', ['steps']),
  },
}
</script>

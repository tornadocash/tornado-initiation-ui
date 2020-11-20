<template>
  <div class="steps">
    <step v-for="(step, index) in getData" :key="index" :data="step" />
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
    ...mapState('airdrop', ['airdrops']),
    getData() {
      if (Array.isArray(this.airdrops)) {
        return this.steps.map((step, index) => {
          if (step.contract === 'Airdrop.sol') {
            return {
              ...step,
              airdrops: this.airdrops[index - this.airdrops.length + 2],
            }
          }

          return step
        })
      }

      return this.steps
    },
  },
}
</script>

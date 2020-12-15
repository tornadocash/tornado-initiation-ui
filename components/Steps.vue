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
    ...mapState('airdrop', ['airdrops', 'notificationIndex']),
    getData() {
      if (Array.isArray(this.airdrops)) {
        return this.steps.map((step, index) => {
          if (step.contract === 'Airdrop.sol') {
            const dropIndex = index + this.airdrops.length - this.steps.length
            return {
              ...step,
              airdrops: this.airdrops[dropIndex],
              isActive: this.notificationIndex === dropIndex,
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

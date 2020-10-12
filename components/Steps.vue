<template>
  <div class="steps">
    <step v-for="(step, index) in steps" :key="index" :data="step" />
  </div>
</template>

<script>
import Step from '@/components/Step'

export default {
  components: {
    Step,
  },
  data() {
    return {
      steps: [
        { title: 'But I must explain to you how all this mistaken idea' },
        {
          title:
            'Nor again is there anyone who loves or pursues or desires to obtain',
          deployAddress: '0xf7a526d8642f6c6cb98bcda9919209d3c1ce359e',
        },
      ],
    }
  },
}
</script>

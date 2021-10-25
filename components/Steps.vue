<template>
  <div class="steps--container">
    <div v-for="layer in ['L1', 'L2']" :key="`${layer}-steps`" class="steps">
      <h4 class="title is-3 has-text-centered">
        {{ $t(layer.toLowerCase()) }} deployment
      </h4>
      <div class="steps-wrapper">
        <div v-if="isLoggedIn && isDisabledSteps(layer)" class="switch-network">
          <p>{{ $t(`switchTo${layer}`) }}</p>
          <b-button type="is-primary" @click="changeNetwork(layer)">{{
            $t(`switchNetworkTo${layer}`)
          }}</b-button>
        </div>
        <fieldset
          class="fieldset"
          :disabled="isLoggedIn && isDisabledSteps(layer)"
        >
          <step
            v-for="(step, index) in getSteps(layer)"
            :key="index"
            :data="step"
          />
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import Step from '@/components/Step'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Step,
  },
  computed: {
    ...mapState('steps', ['l1Steps', 'l2Steps']),
    ...mapGetters('provider', ['getNetwork', 'getProviderName']),
    isLoggedIn() {
      return !!this.getProviderName
    },
  },
  methods: {
    ...mapActions('provider', ['switchNetwork']),
    isDisabledSteps(layer) {
      const { isL1 } = this.getNetwork
      return isL1 ? layer === 'L2' : layer === 'L1'
    },
    getSteps(layer) {
      return layer === 'L1' ? this.l1Steps : this.l2Steps
    },
    changeNetwork(layer) {
      const netId = layer === 'L1' ? 1 : 100
      this.switchNetwork({ netId })
    },
  },
}
</script>

<style scoped lang="scss">
.switch-network {
  display: block;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 400;
  box-shadow: 0 1px 2px 1px rgba(0, 1, 0, 0.2);
  z-index: 888;
  background-color: #393939;
  color: #eee;
  align-items: center;

  position: sticky;
  top: 1.25rem;
  bottom: 1.25rem;
  z-index: 1;
  margin: 0 auto;
  margin-bottom: 1.25rem;

  max-width: 320px;
  text-align: center;

  .button {
    margin-top: 1.25rem;
  }

  @media (min-width: 769px) {
    display: flex;
    max-width: 560px;
    text-align: left;

    .button {
      margin-top: 0;
      margin-left: 1.25rem;
    }
  }
}

.fieldset[disabled] {
  cursor: not-allowed;
  position: relative;
  filter: grayscale(70%);
  color: #5e5e5e;

  ::v-deep .tooltip-content {
    display: none !important;
  }
}
</style>

<template>
  <div class="wrapper">
    <Navbar />
    <section class="main-content section">
      <div class="container">
        <nuxt />
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { mapActions } from 'vuex'

export default {
  components: {
    Navbar,
    Footer,
  },
  mounted() {
    this.initProvider()
    this.fetchDeploymentStatus()
  },
  methods: {
    ...mapActions('provider', ['initProvider']),
    ...mapActions('steps', ['fetchDeploymentStatus']),
  },
}
</script>

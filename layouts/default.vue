<template>
  <div class="wrapper">
    <Navbar />
    <section class="main-content section">
      <div class="container">
        <nuxt />
      </div>
    </section>
    <Footer />
    <Loading />
    <Notices />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import Notices from '@/components/Notices'
import { mapActions } from 'vuex'
import { localStorage } from '@/utillites'

export default {
  components: {
    Navbar,
    Footer,
    Loading,
    Notices,
  },
  async mounted() {
    const result = localStorage.getItem('provider')
    if (result && result.name) {
      await this.initProvider({
        name: result.name,
        network: result.network,
      })
    }
    this.fetchDeploymentStatus()
    this.statusPooling()
    this.fetchGasPrice()
  },
  methods: {
    ...mapActions('provider', ['initProvider']),
    ...mapActions('steps', ['statusPooling', 'fetchDeploymentStatus']),
    ...mapActions('gasPrice', ['fetchGasPrice']),
  },
}
</script>

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
  mounted() {
    this.fetchDeploymentStatus()

    const result = localStorage.getItem('provider')
    if (result && result.name) {
      this.initProvider({
        name: result.name,
        network: result.network,
      })
    }

    this.fetchGasPrice()
  },
  methods: {
    ...mapActions('provider', ['initProvider']),
    ...mapActions('steps', ['fetchDeploymentStatus']),
    ...mapActions('gasPrice', ['fetchGasPrice']),
  },
}
</script>

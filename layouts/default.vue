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

export default {
  components: {
    Navbar,
    Footer,
    Loading,
    Notices,
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

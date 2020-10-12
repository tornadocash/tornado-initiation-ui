<template>
  <b-navbar wrapper-class="container" class="header">
    <template slot="brand">
      <b-navbar-item tag="router-link" to="/" active-class="">
        <Logo />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  components: {
    Logo,
  },
}
</script>

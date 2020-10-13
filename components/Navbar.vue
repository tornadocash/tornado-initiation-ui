<template>
  <b-navbar wrapper-class="container" class="header">
    <template slot="brand">
      <b-navbar-item tag="router-link" to="/" active-class="">
        <Logo />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item>Info</b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            v-if="isLoggedIn"
            type="is-primary"
            outlined
            icon-left="logout"
            @click="onLogOut"
            >Logout</b-button
          >
          <b-button
            v-else
            type="is-primary"
            outlined
            icon-left="wallet"
            @click="onLogIn"
            >Connect</b-button
          >
        </div>
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
  data() {
    return {
      isLoggedIn: false,
    }
  },
  methods: {
    onLogIn() {},
    onLogOut() {},
  },
}
</script>

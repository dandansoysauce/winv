<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <!-- <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
        > -->
        WINV
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-dropdown label="dandansoysauce">
        <b-navbar-item href="#">
            Profile
        </b-navbar-item>
        <b-navbar-item href="#">
            Settings
        </b-navbar-item>
        <b-navbar-item href="#">
            Logout
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {}
</script>

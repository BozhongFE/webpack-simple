<template>
  <div id="app">
    <img src="./assets/img/logo.png">
    <h1>\{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style{{#less}} lang="less"{{/less}}>
@import './assets/css/reset.css';
#app {
  text-align: center;
  margin-top: 60px;
}
</style>

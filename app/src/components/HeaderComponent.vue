<template>
<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
      HELLO!! {{msg}}
    </a>

    <div class="navbar-burger">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

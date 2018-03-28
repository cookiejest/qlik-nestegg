<template>
<testlist>
<nav class="panel">
  <p class="panel-heading">
    Tests
  </p>
  <a class="panel-block" v-for="test in tests"  v-on:click="selectTest" :testname="test.test_name">
    <span class="panel-icon" >
      <i class="fas fa-book"></i>
    </span>
    {{test.test_name}}
  </a>
</nav>

{{this.$activeTest}}
</testlist>
</template>

          <script>
export default {
  name: "TestListComponent",
  data: function() {
    const selectedvalue = "";
    const tests = [
      {
        test_name: "Test1"
      },
      {
        test_name: "Test2"
      }
    ];

    return {
      tests,
      selectedvalue
    };
  },
  methods: {
    selectTest: function(event) {
      // `this` inside methods points to the Vue instance
      //this.$emit('$activeTest', event.target.getAttribute("testname"));
      // `event` is the native DOM event
      //this.$store.state
      console.log(this.$store)
      //this.$store.commit("setValue", event.target.getAttribute("testname"));

      this.$store.commit({
  type: 'setValue',
  activeTest: event.target.getAttribute("testname")
})
      if (event) {
        // this.selectedvalue = event.target.getAttribute("testname");
        //  this.$activeTest = event.target.getAttribute("testname");
        //  alert(event.target.getAttribute("testname"));
        console.log(event.target.getAttribute("testname"));
      }
    }
  }
};
</script>

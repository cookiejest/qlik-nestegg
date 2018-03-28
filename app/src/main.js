// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import HeaderComponent from '@/components/HeaderComponent'
import TestCaseListComponent from '@/components/TestCaseListComponent'
import TestCaseFormComponent from '@/components/TestCaseFormComponent'
import TestListComponent from '@/components/TestListComponent'
import TestNewFormComponent from '@/components/TestNewFormComponent'
import 'vue-material-design-icons/styles.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(Vuex)

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

/*
function getTest() {
  return {
    test_name: 'John',
    lastName: 'Doe'
  }
}
*/

const store = new Vuex.Store({
  state: {
    activeTest: 'sometest1'
  },
  mutations: {
    setValue(state, payload) {
      state.activeTest = payload.activeTest
    }
  }
})

Vue.prototype.$activeTest = 'My test1'

Vue.config.productionTip = false

Vue.component('header-component', HeaderComponent)
Vue.component('test-case-list-component', TestCaseListComponent)
Vue.component('test-case-form-component', TestCaseFormComponent)
Vue.component('test-list-component', TestListComponent)
Vue.component('test-new-form-component', TestNewFormComponent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  computed: Vuex.mapState(['activeTest']),
  components: { App },
  template: '<App/>'
})

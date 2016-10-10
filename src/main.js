// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import CustomActions from './components/CustomActions'
import MyDetailRow from './components/MyDetailRow'
Vue.component('custom-actions', CustomActions)
Vue.component('my-detail-row', MyDetailRow)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

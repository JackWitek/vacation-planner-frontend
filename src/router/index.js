import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import Plan from '@/components/Plan.vue'

import Vacation from '@/components/Vacation.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/vacation',
      name: 'VacationDisplay',
      component: Vacation,
      props: true
    },
    {
      path: '/plan',
      name: 'Plan',
      component: Plan,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})

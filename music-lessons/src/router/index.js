import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home.vue'
import StudentPage from '../components/StudentPage.vue'
import TeacherHome from '../components/TeacherHome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/student",
    name: "StudentPage",
    component: StudentPage,
    meta: {
      requiresAuth: true
    }
  },
    {
      path: "/teacher-home",
      name: "TeacherHome",
      component: TeacherHome,
      meta: {
        requiresAuth: true
      }
    },
    {
    path: "/teacher-lessons",
    name: "TeacherLessons",
    meta: {
      requiresAuth: true
    } 
  }
  ];

  const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
  });

  router.beforeEach((to, from , next) => {
    if (to.name === from .name) {
      return next();
    }
    next();
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if(localStorage.getItem("token") == null) {
        next({
          path: "/"
        });
      }else {
        next();
      }
    } else {
      next();
    }
  });
  
  export default router;
import Vue from "vue";
import Router from "vue-router";

import Home from "@/components/Home";
import Me from "@/components/Me";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import firebase from "firebase";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "*",
      redirect: "/home"
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        hideTab: true
      }
    },
    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/me",
      name: "Me",
      component: Me,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !currentUser) {
    next("login");
  } else if (currentUser && to.name=="Login") {
    next("home");
  }else{
    next();
  }
});

export default router;

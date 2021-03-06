// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import router from "./router";
import firebase from "firebase";
import helper from "./helper/helper";
import api from "./helper/api";
import firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import VueClipboard from 'vue-clipboard2'

import App from "./App";


Vue.use(VueClipboard)
Vue.use(MintUI);
Vue.use(helper);
Vue.use(api);
Vue.config.productionTip = false;

let app;
let config = {
  apiKey: "AIzaSyCxD8ah_Sr-XW4TS60NKcNSIeqK0J9r5uU",
  authDomain: "giftcenter-bfb43.firebaseapp.com",
  databaseURL: "https://giftcenter-bfb43.firebaseio.com",
  projectId: "giftcenter-bfb43",
  storageBucket: "",
  messagingSenderId: "588104440534"
};

firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: "#app",
      template: "<App/>",
      components: { App },
      router
    });
  }
});

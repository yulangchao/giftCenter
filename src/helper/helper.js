import firebase from "firebase";
import { Indicator, Toast, MessageBox } from "mint-ui";
let helper = function(Vue, options) {
  Vue.prototype.mainUrl = "https://gc.beimei.online";
  Vue.prototype.loading_spin = false;
  Vue.prototype.objectToForm = function(data) {
    let formData = new FormData();

    for (let key in data) {
      formData.append(key, data[key]);
    }
    return formData;
  };
  Vue.prototype.currentUser = function() {
    if (firebase.auth().currentUser){
      return JSON.parse(localStorage.getItem('userInfo'));
    }else{
      return null;
    }
  };
  Vue.prototype.getUid = function() {
    if (firebase.auth().currentUser){
      return firebase.auth().currentUser.uid;
    }else{
      return -1;
    }
  };

  Vue.prototype.getImage = function(path) {
    return this.mainUrl + path;
  };

  Vue.prototype.user = null;

  Vue.prototype.tabs = [
    { id: "主页", tab: "home", href: "home", image: "home.png" },
    { id: "我的", tab: "me", href: "me", image: "me.png" }
  ];

  Vue.$messagebox = Vue.prototype.$messagebox = MessageBox;
  Vue.$toast = Vue.prototype.$toast = Toast;
  Vue.$indicator = Vue.prototype.$indicator = Indicator;
};

export default helper;

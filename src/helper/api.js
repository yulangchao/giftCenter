import firebase from "firebase";
import axios from "axios";
let api = function(Vue, options) {
  Vue.prototype.url = "https://gc.beimei.online/api/";
  Vue.prototype.getHeader = function(path = "", callback) {
    return {token:  this.currentUser() ? this.currentUser().token: null};
  };
  Vue.prototype.Apiget = function(path = "", callback) {
    axios.get(this.url + path).then(response => {
      callback(response.data);
    });
  };
};

export default api;

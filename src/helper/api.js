import firebase from "firebase";
import axios from "axios";
let api = function(Vue, options) {
  Vue.prototype.url = "http://localhost/api/";
  Vue.prototype.getHeader = function(path = "", callback) {
    return {token:  this.currentUser().token};
  };
  Vue.prototype.Apiget = function(path = "", callback) {
    axios.get(this.url + path).then(response => {
      callback(response.data);
    });
  };
};

export default api;

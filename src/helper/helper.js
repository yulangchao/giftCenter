let helper = function(Vue, options) {
  Vue.prototype.abc = function() {
    //全局函数1
    return "123";
  };

  Vue.prototype.tabs  = [
      {'id':'主页','tab':'home',href:"home",image:'home.png'},
      {'id':'我的','tab':'me',href:"me",image:'me.png'},
  ]
};

export default helper;

<template>
  <div id="app">

    <router-view></router-view>
    <mt-tabbar v-model="selected">
      <template v-for="tab in tabs" v-if="!$route.meta.hideTab">

        <mt-tab-item :id="tab.id" @click.native="gotoTab(tab.href)">
          <img slot="icon" :src="getImgUrl(tab.image)"> {{tab.id}}
        </mt-tab-item>
      </template>
    </mt-tabbar>
  </div>

</template>

<script>

export default {
    name: "app",
    data() {
        return {
            selected: ""
        };
    },
    created() {
        this.initTabarActive();
    },
    beforeUpdate: function() {
        this.initTabarActive();
    },
    methods: {
        initTabarActive() {
            for (let i = 0; i < this.tabs.length; i++) {
                if (this.$route.path.indexOf(this.tabs[i].href) != -1) {
                    this.selected = this.tabs[i].id;
                    return;
                }
            }
        },
        gotoTab(href) {
            this.$router.replace("/" + href);
        },
        getImgUrl(pic) {
            return require("./assets/tabs/" + pic);
        }
    }
};
</script>

<style lang="less">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    overflow: hidden;
}
ul {
    padding-left: 0;
}
body {
    padding: 40px 0px 60px 0px !important;
    /* Firefox */
    height: -moz-calc(100vh - 100px) !important;
    /* WebKit */
    height: -webkit-calc(100vh - 100px) !important;
    /* Opera */
    height: -o-calc(100vh - 100px) !important;
    /* Standard */
    height: calc(100vh - 100px) !important;
    margin: 0px !important;
    overflow: hidden !important;
}
.mint-header {
    background: linear-gradient(90deg, #f53900f7, #ff0101f2) !important;
}
.mint-tabbar {
    position: fixed;
    bottom: 0;
}

.mint-popup-3 {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.mint-popup-3 .mint-button {
    position: absolute;
    width: 90%;
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
}
</style>

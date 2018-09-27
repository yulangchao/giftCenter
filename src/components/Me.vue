<template>
    <div>
        <!--标题-->
        <mt-header fixed title="我的账号"></mt-header>
        <div class="aui-head-bg">
            <div class="aui-head-user">
                <img :src="this.mainUrl + '/uploads/20180928/d00a7e2dc1d2d23f5feb3a45b264f3a4.png'" alt="">
            </div>
            <div class="aui-head-name">
                <h2>
                    {{currentUser().mobile}}
                    <em>中奖次数0</em>
                </h2>
            </div>
        </div>
        <div class="aui-flex b-line">
            <div class="aui-flex-user">
                <img src="http://www.17sucai.com/preview/1268063/2018-09-10/secure/images/icon-item-001.png" alt="">
            </div>
            <div class="aui-flex-box">
                <h2>登录日志</h2>
                <p>开启验证保护,账户更安全</p>
            </div>
            <div class="aui-flex-arrow"></div>
        </div>
        <div class="aui-flex b-line">
            <div class="aui-flex-user">
                <img src="http://www.17sucai.com/preview/1268063/2018-09-10/secure/images/icon-item-002.png" alt="">
            </div>
            <div class="aui-flex-box">
                <h2>关于此app</h2>
                <p>抽奖而生</p>
            </div>
            <div class="aui-flex-arrow"></div>
        </div>
        <div class="aui-flex b-line">
            <div class="aui-flex-user">
                <img src="http://www.17sucai.com/preview/1268063/2018-09-10/secure/images/icon-item-002.png" alt="">
            </div>
            <div class="aui-flex-box" @click="logout">
                <h2>登出</h2>
            </div>
            <div class="aui-flex-arrow"></div>
        </div>

    </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
export default {
    name: "me",
    data() {
        return {};
    },
    methods: {
        logout: function() {
            this.$indicator.open("正在退出...");
            axios
                .get(this.url + "user/logout", {
                    headers: this.getHeader()
                })
                .then(response => {
                    firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            this.$indicator.close();
                            localStorage.removeItem('userInfo');
                            this.$router.replace("home");
                        });
                })
                .catch(error => {
                    this.$indicator.close();
                });
        }
    }
};
</script>

<style lang="less" scoped>
.aui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 15px;
    position: relative;
    text-align: left;
}
.aui-flex-user {
    width: 35px;
    height: 35px;
    margin-right: 8px;
}
.aui-flex-user img {
    width: 100%;
    height: auto;
    border: none;
    display: block;
}
.aui-flex-box {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: #333;
}
.aui-flex-box h2 {
    color: #333333;
    font-size: 1rem;
    font-weight: normal;
    padding-bottom: 5px;
}
.aui-flex-box p {
    color: #777777;
    font-size: 0.8rem;
}
.aui-flex-arrow {
    position: relative;
}
.aui-flex-arrow:after {
    content: " ";
    display: inline-block;
    height: 7px;
    width: 7px;
    border-width: 2px 2px 0 0;
    border-color: #c3c3c6;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 2px;
}
.b-line:after {
    content: "";
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #e2e2e2;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

.aui-head-bg {
    background-image: url(http://www.17sucai.com/preview/1268063/2018-08-29/leaguer/images/head-bj.png);
    height: 11rem;
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
}
.aui-head-user {
    width: 70px;
    height: 70px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -35px;
    margin-top: -10px;
}
.aui-head-user img {
    width: 100%;
    height: auto;
    display: block;
    border: none;
    border-radius: 100%;
}
.aui-head-name {
    width: 160px;
    height: 25px;
    position: absolute;
    bottom: -5px;
    left: 50%;
    margin-left: -80px;
    font-size: 14px;
    text-align: center;
}
.aui-head-name h2 {
    font-weight: bold;
    font-size: 14px;
    color: #333;
}
.aui-head-name h2 em {
    background: #ea735e;
    color: #fff;
    font-size: 12px;
    border-radius: 20px;
    font-style: normal;
    padding: 0 2px;
}
body {
    padding: 0px !important;
}
</style>

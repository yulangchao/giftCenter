<template>
    <div>
        <mt-popup v-model="addRate" popup-transition="popup-fade" class="mint-popup-1" style="top: 40px ">
            <h1>分享增加倍率</h1>
            <p>每一位朋友的抽奖将带来1倍率的增加。</p>
            <p>方式一：复制链接</p>
            <div class="container">
                <mt-button type="primary" v-clipboard:copy="shareLink" v-clipboard:success="onCopy" v-clipboard:error="onError">复制你的专属链接</mt-button>
            </div>
            <p>方式二：<br>保存以下二维码，并分享给朋友或者发布到朋友圈</p>
            <img class="qr-image" v-lazy="shareImage">
        </mt-popup>
        <mt-popup v-if="gift" v-model="top10" popup-transition="popup-fade" class="mint-popup-1" style="top: 40px ">
            <h1>倍率Top 10</h1>
            <ul>
                <li>
                    <span class="top-mobile">手机号 </span>
                    <span class="top-rate">倍率</span>
                </li>
                <li v-for="top in gift.top10">
                    <span class="top-mobile">{{ top.mobile }} </span>
                    <span>x {{ top.rate }}</span>
                </li>
            </ul>
            <h1>分享增加倍率</h1>
            <p>每一位朋友的抽奖将带来1倍率的增加。</p>
            <div class="container">
                <mt-button type="primary" v-clipboard:copy="shareLink" v-clipboard:success="onCopy" v-clipboard:error="onError">复制你的分享链接</mt-button>
            </div>

        </mt-popup>
        <mt-header v-if="gift" fixed :title="gift.item_title">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div class="item-image-container" v-if="gift">
            <img class="item-image" v-lazy="mainUrl +gift.item_image">
            <div class="pd-content">
                <p class="pd-name">奖品:
                    <span>{{gift.item_title}} x {{gift.item_number}}</span>
                </p>
                <p class="pd-date">{{gift.open_time}}
                    <template v-if="currentUser()">
                        <span v-if="gift.if_attend">已参与</span>
                        <span class="unattend" v-else>未参与</span>
                    </template>
                </p>
            </div>
            <div class="hline"></div>
            <h3>赞助商</h3>
            <div class="company-container">
                <div v-html="gift.company_content">

                </div>

            </div>

            <img class="company-image" v-for="company_image of gift.company_images.split(',')" v-lazy="mainUrl +company_image">

            <div class="hline"></div>

            <div class="footer">

                <div class="start-gift">
                    <mt-button type="primary" @click.native="addRate = true" ref="button" plain size="small"><img src="../assets/gift/add.png" height="20" width="20" slot="icon">增加倍率</mt-button>
                    <template v-if="gift.if_open_switch == 1">
                        <mt-button type="danger" plain size="small"><img src="../assets/gift/wait.gif" height="20" width="20" slot="icon">已开奖</mt-button>
                    </template>
                    <template v-else>
                        <mt-button v-if="!gift.if_attend" type="danger" @click="startGift" plain size="small"><img src="../assets/gift/start.png" height="20" width="20" slot="icon">开始抽奖</mt-button>
                        <mt-button v-else type="danger" plain size="small"><img src="../assets/gift/wait.gif" height="20" width="20" slot="icon">等待开奖</mt-button>
                    </template>

                </div>
                <p class="attend_count">
                    <span>参与人数: 1000,</span>
                    <span>
                        <a @click="top10 = true">查看top 10 倍率王 ></a>
                    </span>
                </p>

                <router-link to="/home">
                    <mt-button icon="more" plain type="primary" size="small">查看更多抽奖</mt-button>
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
export default {
    name: "gift",
    data() {
        return {
            gift: null,
            addRate: false,
            shareLink: "",
            shareImage: "",
            refer: "",
            top10: false
        };
    },
    mounted() {
        this.$indicator.open();
        this.shareLink = location.href + "&u=" + this.getUid();

        if (this.$route.query.hasOwnProperty("u")) {
            this.refer = this.$route.query.u;
        }
        let link = "https://google.ca";
        axios
            .get(this.url + "gift/detail", {
                params: this.$route.query,
                headers: this.getHeader()
            })
            .then(response => {
                this.gift = response.data.data;
                this.$indicator.close();
                this.shareImage =
                    this.mainUrl +
                    `/qrcode/build?text=${this.shareLink.replace(
                        "/#/",
                        "/%23/"
                    )}&label=%E6%9D%A5%E6%8A%BD%E5%A5%96%E5%95%A6%EF%BC%81${
                        this.gift.item_title
                    }x${
                        this.gift.item_number
                    }!&logo=1&labelhalign=0&labelvalign=3&foreground=%23ffffff&background=%23000000&size=300&padding=10&logosize=50&labelfontsize=14&errorcorrection=medium`;
            })
            .catch(error => {
                this.$indicator.close();
                this.$toast("加载失败，请稍后再试");
            });
    },
    methods: {
        onCopy: function(e) {
            this.$messagebox.alert("复制完成!");
        },
        onError: function(e) {
            this.$messagebox.alert("复制失败!");
        },
        startGift: function() {
            console.log(1);
            if (!this.currentUser()) {
                this.$toast("请先登录！");
                this.$router.push({
                    path: "/login",
                    query: { redirect: location.hash } // 如果你使用钩子函数，your path 可以替换成to.fullPath
                });
            }
            axios
                .post(this.url + "gift/startGift", this.$route.query, {
                    headers: this.getHeader()
                })
                .then(response => {
                    console.log(response);
                    this.gift.if_attend = 1;
                    this.$toast("参加成功，等待开奖！");
                    setTimeout(() => {
                        this.addRate = true;
                    }, 1000);
                })
                .catch(error => {
                    this.$indicator.close();
                    this.$toast("加载失败，请稍后再试");
                });
        }
    }
};
</script>
<style lang="less">
.mint-popup-1 {
    min-width: 260px;
    max-width: 600px;
    width: 80vw;
    border-radius: 8px;
    padding: 10px;
    transform: translate(-50%, 0);
    h1 {
        font-size: 20px;
        color: #26a2ff;
    }
    p {
        &:first-child {
            color: grey;
        }
        margin-bottom: 10px;
        font-size: 14px;
    }
    .top-mobile {
        margin-right: 50px;
    }
    .top-rate {
        margin-left: 15px;
    }
}
.mint-popup-1::before {
    triangle: 10px top #fff;
    content: "";
    position: absolute;
    top: -20px;
    right: 50px;
}

.hline {
    height: 5px;
    background: #f1dada96;
    width: 100vw;
    position: absolute;
    left: 0;
    right: 0;
}
body {
    overflow: scroll !important;
}
.qr-image {
    width: 200px;
}
.item-image-container {
    padding: 0 10px;
    .item-image {
        width: 100%;
        margin-top: 10px;
        border-radius: 5px;
    }
    .company-image {
        width: 100%;
        margin: 20px 0px;
        border-radius: 5px;
    }
    .start-gift {
        margin: 15px 0px;
    }
}

.footer {
    padding: 20px 0px;
}

.pd-content {
    padding: 10px;
}
.attend_count {
    font-size: 12px;
    font-weight: bold;
    overflow: hidden;
    line-height: 12px;
    margin: 20px 0px;
    span {
        font-weight: 100;
        font-size: 12px;
    }
    a {
        color: chocolate;
        margin-left: 5px;
    }
}
.pd-name {
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    line-height: 14px;
    margin: 0px;
    text-align: left;
    span {
        font-weight: 100;
        font-size: 12px;
    }
}

.pd-date {
    margin-top: 8px;
    color: goldenrod;
    text-align: left;
    margin-bottom: 8px;
    span {
        color: white;
        float: right;
        margin-top: -5px;
        background-image: linear-gradient(90deg, #ff9000, #ff5101);
        border-radius: 5px;
        padding: 3px 6px;
    }

    .unattend {
        background-image: linear-gradient(90deg, #e0c4a0, #8c7d76);
    }
}
</style>
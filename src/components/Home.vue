<template>
    <div>
        <!--标题-->
        <mt-header fixed title="抽奖中心"></mt-header>
        <!--滑动区域-->
        <mt-swipe :auto="4000">
            <mt-swipe-item><img src="https://www.gosugamers.net/files/images/news/2017/august/ti%207%20_small.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="https://lolstatic-a.akamaihd.net/frontpage/apps/prod/event-site-announcement-2018/en_US/e6f3b858b0af0b97c54d21e9eef7a3e8950e51ee/assets/img/worlds-header.jpg"></mt-swipe-item>
        </mt-swipe>
        <ul class="tab-nav">
            <li :class="getActiveCls(0)" @click="changeTab(0)">
                <span>未开奖</span>
            </li>
            <li :class="getActiveCls(1)" @click="changeTab(1)">
                <span>已开奖</span>
            </li>
            <li :class="getActiveCls(2)" @click="changeTab(2)">
                <span>参与的活动</span>
            </li>
        </ul>
        <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <!--模拟的轮播,菜单 可在down.callback中配置刷新轮播数据-->

            <!--筛选条件; 模拟列表的重置和演示空布局的使用-->

            <!--展示上拉加载的数据列表-->
            <ul id="dataList" class="data-list">
                <li v-for="pd in dataList" :key="pd.id" @click="gotoGift(pd.id)">
                    <img class="pd-img mescroll-lazy-in" :imgurl="getImage(pd.item_image)" src="/static/giphy.gif">
                    <div class="pd-content">
                        <p class="pd-name">奖品:
                            <span>{{pd.item_title}} x {{pd.item_number}}</span>
                        </p>
                        <p class="pd-date">{{pd.open_time}}
                            <template v-if="currentUser()">
                                <span v-if="pd.if_attend">已参与</span>
                                <span v-else class="unattend">未参与</span>
                            </template>
                        </p>
                    </div>
                </li>
            </ul>
        </mescroll-vue>
    </div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from "mescroll.js/mescroll.vue";
// 模拟数据
import mockData from "../mock/pdlist";
import axios from "axios";
export default {
    name: "home",
    components: {
        MescrollVue
    },
    data() {
        return {
            mescroll: null, // mescroll实例对象
            mescrollUp: {
                callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 10 // 每页数据的数量
                },
                noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                toTop: {
                    src: require("../assets/others/up.png") // 回到顶部按钮的图片路径,支持网络图
                },
                empty: {
                    // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
                    warpId: "dataList", // 父布局的id;
                    icon:
                        "https://orig00.deviantart.net/23ac/f/2016/137/4/9/chibi_singed_sd_by_kairui_chan-da2umnu.png", // 图标,支持网络图
                    tip: "暂无相关数据~", // 提示
                    btntext: "去逛逛 >", // 按钮,默认""
                    btnClick() {
                        // 点击按钮的回调,默认null
                        alert("点击了按钮,具体逻辑自行实现");
                    }
                },
                lazyLoad: {
                    use: true // 是否开启懒加载,默认false
                }
            },
            dataList: [], // 列表数据
            pdType: 0 // 菜单
        };
    },
    beforeRouteEnter(to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
            vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
        });
    },
    beforeRouteLeave(to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
        this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
        next();
    },
    methods: {
        gotoGift(id) {
            this.$router.push({ name: "Gift", query: { id: id } });
        },
        // mescroll组件初始化的回调,可获取到mescroll对象
        mescrollInit(mescroll) {
            this.mescroll = mescroll;
        },
        // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
        upCallback(page, mescroll) {
            // 模拟联网
            this.getListDataFromNet(
                this.pdType,
                page.num,
                page.size,
                arr => {
                    // 如果是第一页需手动制空列表
                    if (page.num === 1) this.dataList = [];
                    // 把请求到的数据添加到列表
                    this.dataList = this.dataList.concat(arr);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length);
                    });
                },
                () => {
                    // 联网异常,隐藏上拉和下拉的加载进度
                    mescroll.endErr();
                }
            );
        },

        // 选中状态的样式
        getActiveCls(type) {
            return this.pdType === type
                ? "tab-nav-item tab-active"
                : "tab-nav-item";
        },
        // 切换菜单
        changeTab(type) {
            if (type == 2 && !this.currentUser()) {
                this.$toast("请先登录");
                this.$router.push("login");
            }
            if (this.pdType !== type) {
                this.pdType = type;
                this.dataList = []; // 在这里手动置空列表,可显示加载中的请求进度
                this.mescroll.resetUpScroll(); // 刷新列表数据
            }
        },

        /* 联网加载列表数据
       在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
       请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
       实际项目以您服务器接口返回的数据为准,无需本地处理分页.
       * */
        getListDataFromNet(
            pdType,
            pageNum,
            pageSize,
            successCallback,
            errorCallback
        ) {
            axios
                .get(this.url + "gift", {
                    params: {
                        page: pageNum, //页码
                        limit: pageSize, //每页长度
                        type: pdType
                    },
                    headers: this.getHeader()
                })
                .then(response => {
                    //回调
                    successCallback(response.data.data);
                })
                .catch(e => {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    errorCallback && errorCallback();
                });
        }
    }
};
</script>

<style lang="less">
/*以fixed的方式固定mescroll的高度*/
.mescroll-totop {
    bottom: 80px !important;
}
.mescroll {
    position: fixed;
    top: 190px;
    bottom: 0;
    z-index: 1;
    height: auto !important;
    padding-bottom: 60px;
    max-width: 800px;
}
.swiper {
    width: 100%;
    vertical-align: bottom;
}

.nav {
    text-align: center;
    border-bottom: 1px solid #ddd;
}

.nav p {
    display: inline-block;
    width: 30%;
    padding: 10px 0;
}

.nav .active {
    border-bottom: 1px solid #ff6990;
    color: #ff6990;
}
.data-list {
    padding-left: 0px;
    margin-top: 30px;
}
.data-list li {
    position: relative;
    height: 220px;
    margin: 10px;
    background: white;
    border-radius: 10px;
    border-bottom: 1px solid #eee;
}

.data-list .pd-img {
    border-radius: 10px 10px 0 0;
    width: 100%;
    height: 150px;
}

.data-list .pd-content {
    padding: 10px;
}

.data-list .pd-name {
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

.data-list .pd-date {
    margin-top: 8px;
    color: goldenrod;
    text-align: left;
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

.tab-nav {
    /* padding-top: 10px; */

    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    height: 40px;
    line-height: 40px;
    /* border-radius: 80px; */
    display: block;
    position: relative;
    /* margin-bottom: 15px; */
    /* position: fixed; */
    background: #fff;
    z-index: 2;
    width: 90%;
    /* border-bottom: 10px solid #ededed; */
    margin: 0 auto;
    border-radius: 5px;
    margin-top: -20px;
    margin-bottom: 1px;
}
.tab-nav-item {
    height: 40px;
    line-height: 45px;
    position: relative;
    text-align: center;
    color: #585858;
    font-size: 0.9rem;
    display: block;
    float: left;
    border-radius: 80px;
    /* padding: 0 15px; */
    width: 33.3%;
    /* padding-top: 10px; */
}
.tab-nav-item.tab-active a {
    color: #000000;
    font-weight: bold;
}

.tab-nav-item a span {
    display: block;
}
.tab-nav-item a {
    display: inherit;
    color: inherit;
    font-size: 0.85rem;
    color: #7d7d7d;
}
.tab-nav-item.tab-active:before {
    content: "";
    width: 50%;
    height: 1px;
    position: absolute;
    left: 50%;
    bottom: 0px;
    margin-left: -25%;
    z-index: 4;
    background-color: #f0250f;
    border: 1px solid #f0250f;
}

.mint-swipe-items-wrap {
    min-height: 150px;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>

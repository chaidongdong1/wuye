//index.js
const app = getApp();
let userId;
Page({
  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    notice: [], //公示公告
    showLoading: true, //加载中动画
    wuyeName: '', //配置信息、小区物业名字
    activity: [], //社区活动
    storeActivity: [], //店铺活动
    news: [], //社区新闻
    hotShop: [], //热销商品
    currPage: 1, //新品推荐分页页数
    totalPage: '', //新品推荐总页数
    newShop: [], //新品推荐商品
    repa: '', //正在维修的维修订单
  },
  onLoad: function() {
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    //获取小区物业名字
    wx.request({
      method: 'GET',
      url: `${app.globalData.api}index/loadConfigs`,
      success: res => {
        console.log(res);
        this.setData({
          wuyeName: res.data.data
        });
        console.log(this.data.wuyeName);
      },
      fail: res => {
        console.log(res);
      }
    });
    //公告快讯
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}index/getArticleList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cnt: 6,
        p: 1
      },
      success: res => {
        console.log(res);
        //社区活动截取时间
        let active = res.data.data[1].articleChildList.root.map(item => {
          item.createTime = item.createTime.slice(0, 10);
          return item;
        });
        //社区新闻截取时间
        let news = res.data.data[2].articleChildList.root.map(item => {
          item.createTime = item.createTime.slice(0, 10);
          return item;
        });
        //社区新闻截取个数（前三个）
        let activeNews = news.slice(0, 3);
        this.setData({
          notice: res.data.data[0].articleChildList.root,
          activity: active,
          news: activeNews,
        });
        console.log(this.data.news);
      },
      fail: res => {
        console.log(res);
      }
    });
    //热销商品
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Goods/getGoodsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        isAdminBest: 1,
        cnt: 3
      },
      success: res => {
        console.log(res);
        this.setData({
          hotShop: res.data.data.root
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    //店铺活动
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Shops/recomShopsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cnt: 5
      },
      success: res => {
        console.log(res);
        this.setData({
          storeActivity: res.data.data.root
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    this.getLists();
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  onShow() {
    //我的报修
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Repair/getRepairList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        orderStatus: '0,10'
      },
      success: res => {
        console.log(res);
        if (res.data.data.length != 0) {
          this.setData({
            repa: res.data.data[0]
          });
        }
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //新品推荐
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Goods/getGoodsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        isAdminRecom: 1,
        cnt: 10,
        p: this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          newShop: this.data.newShop.concat(res.data.data.root),
          totalPage: res.data.data.totalPage,
          currPage: res.data.data.currPage,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //上拉加载下一页
  onReachBottom() {
    if (this.data.currPage * 1 < this.data.totalPage * 1) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.setData({
        showLoading: true
      });
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
  //点击跳转店铺（店铺活动）
  bindMalls(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //点击跳转报修详情
  bindMend(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../repDetails/repDetails?orderid=${orderid}`
    });
  },
  //店铺活动跳转更多
  bindMallsMove() {
    wx.navigateTo({
      url: '../activelist/activelist'
    });
  },
  //新品列表
  bindtapNewMore() {
    wx.navigateTo({
      url: '../newShop/newShop'
    });
  },
  //新品商品详情
  bindtapNew(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //热销跳转列表
  bindtapHotMore() {
    wx.navigateTo({
      url: '../hotShop/hotShop'
    });
  },
  //热销跳转详情
  bindtapHotShop(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //跳转社区活动详情
  bindtapActivity(e) {
    console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&type="activity"`
    });
  },
  //社区活动列表
  bindtapCommun() {
    wx.navigateTo({
      url: '../community/community'
    });
  },
  //跳转社区新闻列表
  bindtapNews() {
    wx.navigateTo({
      url: '../comNews/comNews'
    });
  },
  //跳转社区新闻详情页
  bindtapNewsDetails(e) {
    console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&type="news"`
    });
  },
  //跳转精品商城
  bindMall() {
    wx.navigateTo({
      url: '../mall/mall'
    });
  },
  //在线报修
  bindtapRep() {
    wx.switchTab({
      url: '../repairs/repairs'
    });
  },
  //点击跳转搜索页面
  bindtapSeek() {
    wx.navigateTo({
      url: '../seek/seek'
    });
  },
  //公告快讯列表
  bindtapNotice() {
    wx.navigateTo({
      url: '../noticelist/noticelist'
    });
  },
});
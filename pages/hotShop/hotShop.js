// pages/newShop/newShop.js
const app = getApp();
Page({

  data: {
    baseUrl:app.globalData.baseUrl,
    newShop: [], //商品数组
    totalPage: '', //总页数
    currPage: 1,  //当前页数
    showLoading: true, //是否显示加载
  },

  onLoad: function(options) {
    this.getLists();
  },
  getLists(){
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Goods/getGoodsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        isAdminBest: 1,
        cnt: 20,
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
  //新品商品详情
  bindtapNew(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
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
})
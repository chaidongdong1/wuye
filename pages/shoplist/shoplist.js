// pages/shoplist/shoplist.js
const app = getApp();
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    showLoading: true, //加载中动画
    datas: [], //列表信息
    currPage: 1, //当前页数
    totalPage: '', //总页数
  },

  onLoad: function(options) {
    this.getLists();
  },
  //获取列表信息
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Shops/getShopsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cnt: 3,
        p: this.data.currPage,
      },
      success: res => {
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          showLoading: false,
          datas: this.data.datas.concat(res.data.data.root),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
        });
        console.log(this.data.datas)
      },
      fail: res => {
        console.log(res);
        this.setData({
          showLoading: false
        });
      }
    });
  },
  //点击去逛逛跳转店铺详情
  bindtapMall(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //商品详情跳转
  bindtapShop(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //下拉加载下一页
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
      console.log('已到最后一页');
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      datas: [], //列表信息
      currPage: 1, //当前页数
      totalPage: '', //总页数
    });
    this.getLists();
  },
});
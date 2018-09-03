// pages/brandShop/brandShop.js
const app = getApp();
let brandid;
Page({

  data: {
    showLoading: true, //加载动画
    baseUrl: app.globalData.baseUrl, //图片路径
    brandname: '', //品牌名称
    datas: [], //商品数组
    currPage: 1, //当前页数
    totalPage: '', //总页数
  },

  onLoad: function(options) {
    console.log(options);
    brandid = options.brandid;
    if (options.brandname) {
      this.setData({
        brandname: options.brandname
      });
      wx.setNavigationBarTitle({
        title: this.data.brandname
      });
    }
    this.getLists();
  },
  //商品列表
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Goods/getGoodsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        brandId: brandid,
        cnt: 10,
        p: this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.data.root),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击商品跳转详情
  bindtapShop(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //分享
  onShareAppMessage: function(res) {
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
});
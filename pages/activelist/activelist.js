// pages/activelist/activelist.js
const app = getApp();
Page({

  data: {
    baseUrl:app.globalData.baseUrl,
    datas: [],
    currPage: 1,
    totalPage: '',
    showLoading:true
  },

  onLoad: function(options) {
    this.getLists();
  },
  getLists() {
    //店铺活动
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Shops/recomShopsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cnt: 10,
        p:this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.data.root),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
          showLoading:false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击跳转店铺（店铺活动）
  bindMall(e){
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
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
});
// pages/my/my.js
const app = getApp();
let userId;
Page({

  data: {
    userScore: 0, //我的积分
    showLoading: true,
    datasNumber: [], //数量接口
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId')
  },
  onShow() {
    //获取积分信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Users/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId
      },
      success: res => {
        console.log(res);
        wx.stopPullDownRefresh();
        this.setData({
          userScore: res.data.data.userScore,
          datasNumber: res.data.data.orderNum,
          showLoading: false
        });
      },
      fail: res => {
        this.setData({
          showLoading: false
        });
        console.log(res);
      }
    });
  },
  //点击查看积分明细
  bindIntegral() {
    wx.navigateTo({
      url: '../integral/integral'
    });
  },
  //查看所有订单
  bintapOrder() {
    wx.navigateTo({
      url: '../orderList/orderList'
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //下拉刷新
  onPullDownRefresh() {
    this.onShow();
  }
});
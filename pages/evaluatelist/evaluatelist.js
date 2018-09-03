// pages/evaluatelist/evaluatelist.js
const app = getApp();
let userId, orderId;
Page({

  data: {
    datas: [], //商品列表
    baseUrl: app.globalData.baseUrl
  },

  onLoad: function(options) {
    console.log(options);
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    orderId = options.orderid;
  },
  onShow() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Orders/getOrderInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        orderId: orderId
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: res.data.goodsList
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击评价
  bindPing(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../submitevaluate/submitevaluate?orderid=${orderid}&goodsid=${goodsid}`
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
})
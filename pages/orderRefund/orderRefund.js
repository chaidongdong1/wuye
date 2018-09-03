// pages/orderRefund/orderRefund.js
const app = getApp();
let userId, orderId;
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    datas: '', //订单信息
    goods: [], //商品列表
    logs: [], //商品状态列表
    text: '', //退款原因
    showLoading: true
  },

  onLoad: function(options) {
    console.log(options);
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    orderId = options.orderid;
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
          datas: res.data.order,
          goods: res.data.goodsList,
          logs: res.data.logs,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //退款原因
  bindText(e) {
    this.setData({
      text: e.detail.value
    });
  },
  //退款提交按钮
  bindButton() {
    if (this.data.text) {
      this.setData({
        showLoading: true
      });
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Orders/refund`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: userId,
          orderId: orderId,
          refundRemark: this.data.text
        },
        success: res => {
          console.log({
            userId: userId,
            orderId: orderId,
            refundRemark: this.data.text
          });
          this.setData({
            showLoading: false
          });
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: '退款中',
              icon: 'success',
              duration: 1500
            });
            setTimeout(res => {
              wx.navigateBack({
                delta: 1
              });
            }, 500);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500
            });
          }
        },
        fail: res => {
          this.setData({
            showLoading: false
          });
          console.log(res);
        }
      });
    } else {
      wx.showToast({
        title: '请输入退款原因',
        icon: 'none',
        duration: 1500
      });
    }
  },
  //点击跳转店铺
  bindMall(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //点击跳转商品
  bindShops(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
});
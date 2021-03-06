// pages/repList/repList.js
const app = getApp();
let userId;
Page({

  data: {
    being: [], //正在维修
    stocks: [], //已完成的维修
    showLoading: true,
    baseUrl:app.globalData.baseUrl+'Data',
  },

  onLoad: function(options) {
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
  },
  onShow() {
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
        wx.stopPullDownRefresh();
        this.setData({
          being: res.data.data
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Repair/getRepairList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        orderStatus: '20'
      },
      success: res => {
        console.log(res);
        this.setData({
          stocks: res.data.data,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //确认维修已完成
  bindStocks(e) {
    let orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '温馨提示',
      content: '你的报修是否已经完成',
      success: res => {
        if (res.confirm) {
          this.setData({
            showLoading: true
          });
          console.log('用户点击确定');
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Repair/finishOrder`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: userId,
              orderId: orderid
            },
            success: res => {
              console.log({
                userId: userId,
                orderId: orderid
              });
              this.setData({
                showLoading: false
              });
              console.log(res);
              if (res.data.stauts == 1) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(res => {
                  this.onShow();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击跳转详情
  bindDetails(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../repDetails/repDetails?orderid=${orderid}`
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.onShow();
  }
});
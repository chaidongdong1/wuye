// pages/repDetails/repDetails.js
const app = getApp();
let userId;
Page({

  data: {
    datas: '', //详情信息
    wuyePhoto: '', //物业电话
    showLoading: true,
    baseUrl:app.globalData.baseUrl+'Data',
  },

  onLoad: function(options) {
    console.log(options);
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Repair/getRepairList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        orderId: options.orderid
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: res.data.data[0],
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    //配置信息
    wx.request({
      method: 'GET',
      url: `${app.globalData.api}index/loadConfigs`,
      success: res => {
        console.log(res);
        this.setData({
          wuyePhoto: res.data.data.phoneNo
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击给师傅拨打电话
  bindMaster(e) {
    let usertel = e.currentTarget.dataset.usertel;
    wx.makePhoneCall({
      phoneNumber: usertel
    });
  },
});
// pages/about/about.js
const app = getApp();
Page({

  data: {
    mallName: '', //小程序名称
    phoneNo: '', //客服电话
    qqNo: '', //客服QQ
    mailAddress: '', //邮箱
    mallDesc: '', //小程序描述
    showLoading:true,
  },

  onLoad: function(options) {
    wx.request({
      method: 'GET',
      url: `${app.globalData.api}index/loadConfigs`,
      success: res => {
        console.log(res);
        this.setData({
          mallName: res.data.data.mallName,
          phoneNo: res.data.data.phoneNo,
          qqNo: res.data.data.qqNo,
          mailAddress: res.data.data.mailAddress,
          mallDesc: res.data.data.mallDesc,
          showLoading:false
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
  //点击拨打电话
  bindPhoto() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNo
    })
  },
});
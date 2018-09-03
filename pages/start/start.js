// pages/start/start.js
const app = getApp();
let userId, setInter, userInfo;
Page({

  data: {
    datas: '', //小程序信息
    showLoading: true, //加载中动画
  },
  onLoad: function(options) {
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    userInfo = wx.getStorageSync('userInfo');
    console.log(userId);
    // console.log(userInfo);
    //判断是否授权 授权后直接跳转到index
    if (userInfo && userId) {
      wx.switchTab({
        url: '../index/index'
      });
    }
    //清空缓存时没有userId
    if (!userId) {
      console.log('没有userId时')
      //没有userId时 一直请求userId
      setInter = setInterval(() => {
        userId = wx.getStorageSync('userId');
        if (userId) {
          console.log('结束')
          clearTimeout(setInter);
        }
      }, 50);
    }
    console.log(userId);
    //获取配置信息接口
    wx.request({
      method: 'GET',
      url: `${app.globalData.api}index/loadConfigs`,
      success: res => {
        console.log(res);
        this.setData({
          datas: res.data.data,
          showLoading: false, //加载中动画
        })
        console.log(this.data.datas);
      },
      fail: res => {
        this.setData({
          showLoading: false,
        });
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
  //按钮的点击事件
  bindGetUserInfo(e) {
    console.log(userId);
    console.log(e);
    //查询是否授权
    wx.getSetting({
      success: res => {
        console.log(res);
        //未授权时
        if (res.authSetting['scope.userInfo'] == true) {
          userInfo = e.detail.userInfo;
          wx.setStorageSync('userInfo', userInfo);
          console.log(userInfo);
          console.log('已授权');
          //授权过后，传用户信息
          this.setData({
            showLoading: true
          });
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Users/modify`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: userId,
              userName: userInfo.nickName,
              userPhoto: userInfo.avatarUrl
            },
            success: res => {
              console.log(res);
              console.log({
                userId: userId,
                userName: userInfo.nickName,
                userPhoto: userInfo.avatarUrl
              });
              this.setData({
                showLoading: false
              });
              if (res.data.stauts == 1) {
                wx.switchTab({
                  url: '../index/index'
                });
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1500
                })
              }
            },
            fail: res => {
              this.setData({
                showLoading: false
              });
              console.log(res);
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1500
              })
            }
          });
        } else { //已授权
          console.log('未授权');
        }
      }
    });
  },
});
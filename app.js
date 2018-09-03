//app.js
let userId;
App({
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //登陆接口，获取userId
          wx.request({
            method: 'POST',
            url: `${this.globalData.api}Users/get_openid`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              code: res.code
            },
            success: res => {
              if (res.data.stauts == 1) {
                console.log(res);
                userId = res.data.data.userId;
                this.globalData.userId = userId; //把userId存入globalData
                wx.setStorageSync('userId', userId); //把userId存入缓存
                console.log(this.globalData.userId)
              } else {
                console.log(res);
                console.log(msg);
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1500,
                });
              }
            },
            fail: res => {
              console.log(res);
              console.log('登陆失败')
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500,
              });
            }
          });
        } else {
          console.log(res);
          console.log('登陆失败' + res.msg);
        }
      }
    });
    wx.request({
      method: 'GET',
      url:`${this.globalData.api}index/loadConfigs`,
      success:res=>{
        console.log(res);
        this.globalData.applet = res.data.data.mallName;
      },
      fail:res=>{
        console.log(res);
      }
    });
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //         }
    //       });
    //     }
    //   }
    // });
  },
  globalData: {
    // userInfo: null, //用户信息
    userId: '', //用户userId
    api: 'https://towass.honghuseo.cn/index.php/Mobile/', //接口地址
    baseUrl: 'https://towass.honghuseo.cn/', //图片地址
    applet:'', //小程序名字
  }
});
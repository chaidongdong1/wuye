// pages/shopcollect/shopcollect.js
const app = getApp();
let userId, shopsId;
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    datas: [], //店铺列表
    showLoading: true, //加载中动画
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId');
  },
  onShow() {
    this.getLists();
  },
  //收藏的店铺列表
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Favorites/getFavoritesList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        type: 'shops',
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: res.data.data,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击跳转店铺详情
  bindMall(e) {
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
  //取消收藏
  bindtapCancel(e) {
    console.log(e);
    shopsId = e.currentTarget.dataset.shopid;
    //已收藏，点击后变为未收藏
    wx.showModal({
      title: '温馨提示',
      content: '您是否取消关注该店铺',
      success: res => {
        if (res.confirm) {
          this.setData({
            showLoading: true
          });
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Favorites/cancelFavorite`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              id: shopsId,
              userId: userId,
              type: 1,
            },
            success: res => {
              console.log({
                id: shopsId,
                userId: userId,
                type: 1,
              });
              this.setData({
                showLoading: false
              });
              console.log(res);
              if (res.data.stauts == 1) {
                this.setData({
                  collect: 0
                });
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'success',
                  duration: 1500
                });
                console.log('--------------')
                setTimeout(res => {
                  this.getLists();
                }, 500);
              } else {
                wx.showToast({
                  title: '取消收藏失败',
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
              wx.showToast({
                title: '取消收藏失败',
                icon: 'none',
                duration: 1500
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
})
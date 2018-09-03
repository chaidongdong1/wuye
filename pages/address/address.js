// pages/address/address.js
const app = getApp();
let userId, type;
Page({

  data: {
    datas: [], //地址列表
    showLoading: true, //加载动画
  },

  onLoad: function(options) {
    console.log(options);
    if (options) {
      type = options.type;
      console.log(type)
    }
    //从缓存中获取userId
    userId = wx.getStorageSync('userId');
  },
  onShow() {
    this.getLists();
  },
  getLists() {
    //地址列表接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Users/getUserAddress`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId
      },
      success: res => {
        console.log(res);
        wx.stopPullDownRefresh();
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
  //选择地址
  bindSelect(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    if (type) {
      app.globalData.address = this.data.datas[index];
      console.log(app.globalData.address);
      wx.navigateBack({
        delta: 1
      });
    }
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //点击默认地址修改默认
  bindtapDefault(e) {
    this.setData({
      showLoading: true
    });
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let revamp = this.data.datas[index];
    console.log(revamp)
    if (revamp.isDefault == 0) {
      //修改地址接口
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Users/userAddressOption`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: userId,
          userName: revamp.userName,
          areaId1: revamp.areaId1,
          address: revamp.address,
          isDefault: 1,
          userPhone: revamp.userPhone,
          id: revamp.addressId,
        },
        success: res => {
          console.log(res);
          console.log({
            userId: userId,
            userName: revamp.userName,
            areaId1: revamp.areaId1,
            address: revamp.areaId1,
            isDefault: 1,
            userPhone: revamp.userPhone,
            id: revamp.addressId,
          })
          this.setData({
            showLoading: false
          });
          if (res.data.stauts == 1) {
            wx.showToast({
              title: '地址修改成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(res => {
              this.getLists();
            }, 500);
          } else {
            wx.showToast({
              title: '默认地址修改失败',
              icon: 'none',
              duration: 1500
            });
          }
        },
        fail: res => {
          console.log(res);
        }
      });
    } else {
      this.setData({
        showLoading: false
      });
      wx.showToast({
        title: '地址修改成功',
        icon: 'success',
        duration: 1500
      });
    }
  },
  //编辑地址
  bindtapRedact(e) {
    let addressid = e.currentTarget.dataset.addressid;
    wx.navigateTo({
      url: `../add-address/add-address?addressid=${addressid}`
    });
  },
  //删除地址
  bindtapDelete(e) {
    let addressid = e.currentTarget.dataset.addressid;
    wx.showModal({
      title: '温馨提示',
      content: '您是否要删除该收货地址',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          this.setData({
            showLoading: true
          });
          //删除地址接口
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Users/delUserAddress`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: userId,
              id: addressid,
            },
            success: res => {
              this.setData({
                showLoading: false
              });
              console.log(res);
              if (res.data.stauts == 1) {
                wx.showToast({
                  title: '地址删除成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(res => {
                  this.getLists();
                }, 500);
              } else {
                wx.showToast({
                  title: '地址删除失败',
                  icon: 'success',
                  duration: 1500
                });
              }
            },
            fail: res => {
              console.log(res);
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getLists();
  },
  //添加地址
  bindtapAdd() {
    wx.navigateTo({
      url: '../add-address/add-address'
    })
  },
});
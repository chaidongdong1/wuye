// pages/add-address/add-address.js
const app = getApp();
let userId, itemNumber, addressid;
Page({

  data: {
    array: [],
    index: 0, //选择的下标
    name: '', //姓名
    number: '', //电话
    detail: '', //详细地址
    isDefault: false, //是否为默认地址
    alter: false, //判断是否为修改地址（true时是修改）
    showLoading: false, //显示加载动画
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId');
    console.log(options);
    addressid = options.addressid;
    wx.request({
      method: 'GET',
      url:`${app.globalData.api}Users/getAreasList`,
      success:res=>{
        console.log(res);
        let array = res.data.data.map(item => item.areaName);
        array.unshift('请选择小区');
        this.setData({
          array:array
        });
        console.log(this.data.array);
      },
      fail:res=>{
        console.log(res);
      }
    });
    //判断是否是修改地址
    if (addressid) {
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      this.setData({
        showLoading: true
      });
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Users/getUserAddress`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: userId,
          addressId: addressid
        },
        success: res => {
          console.log(res);
          console.log({
            userId: userId,
            addressId: addressid
          });
          let arrayIndex = this.data.array.map(item => {
            if (item == res.data.data[0].areaId1) {
              itemNumber = this.data.array.indexOf(item);
            }
          });
          this.setData({
            alter: true,
            showLoading: false,
            name: res.data.data[0].userName,
            number: res.data.data[0].userPhone,
            index: itemNumber,
            detail: res.data.data[0].address,
            isDefault: res.data.data[0].isDefault == 0 ? false : true,
          });
        },
        fail: res => {
          console.log(res);
        }
      });
    }
  },
  //输入的姓名
  bindName(e) {
    this.setData({
      name: e.detail.value
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //输入的电话
  bindNumber(e) {
    this.setData({
      number: e.detail.value
    });
  },
  //选择小区
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  //输入详细地址
  bindAddress(e) {
    this.setData({
      detail: e.detail.value
    });
  },
  //是否设为默认地址
  switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    this.setData({
      isDefault: e.detail.value
    });
  },
  //添加地址
  bindtapAdd() {
    console.log(this.data.number);
    var num = /^[1][0-9]{10}$/;
    if (!this.data.name) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        duration: 1500
      });
    } else if (!this.data.number) {
      wx.showToast({
        title: '请输入您的手机号',
        icon: 'none',
        duration: 1500
      });
    }else if (!num.test(this.data.number)) {
      wx.showToast({
        title: '您输入的手机号有误',
        icon: 'none',
        duration: 1500
      });
    } else if (this.data.index == 0) {
      wx.showToast({
        title: '请选择您所在的小区',
        icon: 'none',
        duration: 1500
      });
    } else if (!this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      });
    } else if (this.data.alter == false) {
      this.setData({
        showLoading: true
      });
      //添加地址接口
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Users/userAddressOption`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: userId,
          userName: this.data.name,
          areaId1: this.data.array[this.data.index],
          address: this.data.detail,
          isDefault: this.data.isDefault == true ? 1 : 0,
          userPhone: this.data.number
        },
        success: res => {
          console.log(res);
          this.setData({
            showLoading: false
          });
          if (res.data.stauts == 1) {
            wx.showToast({
              title: '地址添加成功',
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
              title: '地址添加失败',
              icon: 'none',
              duration: 1500
            })
          }
        },
        fail: res => {
          console.log(res);
        }
      });
    } else {
      this.setData({
        showLoading: true
      });
      //修改地址接口
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Users/userAddressOption`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: userId,
          userName: this.data.name,
          areaId1: this.data.array[this.data.index],
          address: this.data.detail,
          isDefault: this.data.isDefault == true ? 1 : 0,
          userPhone: this.data.number,
          id: addressid,
        },
        success: res => {
          this.setData({
            showLoading: false
          });
          console.log(res);
          if (res.data.stauts == 1) {
            wx.showToast({
              title: '修改添加成功',
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
              title: '修改添加失败',
              icon: 'none',
              duration: 1500
            })
          }
        },
        fail: res => {
          console.log(res);
        }
      });
    }
  },
});
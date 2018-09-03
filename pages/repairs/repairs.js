// pages/repairs/repairs.js
const app = getApp();
let userId;
Page({

  data: {
    array: [], //全部的类型数组
    index: 0, //选中的下标
    arrayName: [], //筛选出来的数组
    text: '', //输入的问题描述
    temp: [], //上传的图片
    address: '', //获取默认地址
    wuyeName: '', //物业名字
    showLoading: true,
    imgs: [], //评价上传后的图片
  },
  onLoad: function(options) {
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    //获取报修类型
    wx.request({
      method: 'GET',
      url: `${app.globalData.api}Repair/getRepairType`,
      success: res => {
        console.log(res);
        let arrysName = res.data.data;
        let arrys = [];
        for (var i = 0; i < arrysName.length; i++) {
          arrys = arrys.concat(arrysName[i].repairName);
        }
        arrys.unshift("请选择报修类型");
        this.setData({
          array: res.data.data,
          arrayName: arrys,
        });
        console.log(this.data.arrayName);
        console.log(this.data.array);
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
          wuyeName: res.data.data.mallTitle
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
  onShow() {
    this.setData({
      address: '',
    });
    if (!app.globalData.address) {
      //获取默认地址接口
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Users/getUserAddress`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: userId,
          isDefault: 1
        },
        success: res => {
          console.log(res);
          this.setData({
            showLoading: false
          });
          if (!res.data.data || res.data.data.length != 0) {
            this.setData({
              address: res.data.data[0],
            });
          }
          console.log(this.data.address)
        },
        fail: res => {
          this.setData({
            showLoading: false
          });
          console.log(res);
        }
      });
    } else {
      this.setData({
        address: app.globalData.address,
        showLoading: false
      });
      console.log(this.data.address)
    }
  },
  //选择类型
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },
  //问题描述内容
  bindText(e) {
    this.setData({
      text: e.detail.value
    });
  },
  //点击上传图片
  bindPhoto(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        var temp = this.data.temp;
        console.log(tempFilePaths);
        console.log(temp);
        if (index == -1) {
          console.log('111111');
          temp = temp.concat(tempFilePaths);
        } else {
          console.log("22222222");
          temp[index] = tempFilePaths[0];
        }
        if (temp.length > 3) {
          temp.splice(3, temp.length - 3);
        }
        this.setData({
          temp: temp
        });
        console.log(this.data.temp);
      }
    });
  },
  //点击删除当前图片
  bindShan(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let temp = this.data.temp;
    // console.log(temp);
    // console.log(index);
    temp.splice(index, 1);
    // console.log(temp)
    this.setData({
      temp: temp
    });
  },
  //点击选择地址
  bindAddress() {
    wx.navigateTo({
      url: '../address/address?type=1'
    })
  },
  //提交报修按钮
  bindButton() {
    if (this.data.index == 0) {
      wx.showToast({
        title: '请选择报修类型',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.text) {
      wx.showToast({
        title: '请输入报修内容',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.address) {
      wx.showToast({
        title: '请选择报修地址',
        icon: 'none',
        duration: 1500
      })
    } else {
      var temp = this.data.temp;
      var len = temp.length;
      if (len == 0) {
        this.evalute();
      } else {
        var copy = temp.slice(0);
        for (var i = 0; i < len; i++) {
          var img = copy.shift();
          this.uploadImg(img);
        }
      }
    }
  },
  // 上传图片
  uploadImg(img) {
    wx.showLoading({
      title: '提交中',
    })
    console.log(img);
    wx.uploadFile({
      url: `${app.globalData.api}common/uploadGoodsPic`,
      filePath: img,
      name: 'file',
      formData: {
        userId: userId,
        'folder': 'repair'
      },
      success: res => {
        console.log(res);
        let ress = JSON.parse(res.data);
        console.log(ress);
        wx.hideLoading();
        if (ress.status == 1) {
          var imgs = this.data.imgs;
          imgs.push(ress.data.Image);
          this.setData({
            imgs: imgs
          });
          var temp = this.data.temp;
          console.log(temp)
          console.log(imgs)
          var len0 = temp.length;
          var len = imgs.length;
          if (len == len0) {
            this.evalute();
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: ress.msg,
            icon: 'none',
            duration: 1500
          });
          console.log("上传失败")
        }
      }
    });
  },
  //提交报修接口
  evalute() {
    this.setData({
      showLoading: true
    });
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Repair/submitOrder`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        consigneeId: this.data.address.addressId,
        orderRemarks: this.data.text,
        fid: this.data.array[this.data.index * 1 - 1].repairId,
        orderSrc1: this.data.imgs[0] == undefined ? '' : this.data.imgs[0],
        orderSrc2: this.data.imgs[1] == undefined ? '' : this.data.imgs[1],
        orderSrc3: this.data.imgs[2] == undefined ? '' : this.data.imgs[2],
      },
      success: res => {
        console.log({
          userId: userId,
          consigneeId: this.data.address.addressId,
          orderRemarks: this.data.text,
          fid: this.data.array[this.data.index * 1 - 1].repairId,
          orderSrc1: this.data.imgs[0] == undefined ? '' : this.data.imgs[0],
          orderSrc2: this.data.imgs[1] == undefined ? '' : this.data.imgs[1],
          orderSrc3: this.data.imgs[2] == undefined ? '' : this.data.imgs[2],
        });
        this.setData({
          showLoading: false
        });
        console.log(res);
        if (res.data.status == 1) {
          wx.showToast({
            title: '报修成功',
            icon: 'success',
            duration: 1500
          });
          setTimeout(res => {
            this.setData({
              index: 0, //选中的下标
              text: '', //输入的问题描述
              temp: [], //上传的图片
              address: '', //获取默认地址
            });
            app.globalData.address = '';
            wx.navigateTo({
              url: '../repList/repList'
            });
          }, 500);
        } else {
          wx.showToast({
            title: "报修失败，请重新操作",
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
      }
    });
  },
  // onHide(){
  //   this.setData({
  //     index: 0, //选中的下标
  //     text: '', //输入的问题描述
  //     temp: [], //上传的图片
  //     imgs: [], //评价上传后的图片
  //   });
  // },
  onUnload() {
    this.setData({
      index: 0, //选中的下标
      text: '', //输入的问题描述
      temp: [], //上传的图片
      imgs: [], //评价上传后的图片
    });
  },
});
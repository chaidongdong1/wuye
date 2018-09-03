// pages/orderSubmit/orderSubmit.js
const app = getApp();
let goods, userId, types;
Page({

  data: {
    address: '', //地址
    baseUrl: app.globalData.baseUrl, //图片路径
    goods: [], //商品信息
    deliveryMoney: 0, //快递费用
    remark: '', //备注信息
    totalMoney: 0, //合计
    submit: true, //判断是否能提交订单
    showLoading: true
  },

  onLoad: function(options) {
    //从缓存中获取userId
    if (options.types) {
      types = options.types;
    }
    userId = wx.getStorageSync('userId');
    goods = app.globalData.goods;
    this.setData({
      goods: goods
    });
    console.log(app.globalData.goods);
    //计算快递费用
    let deliveryMoney = 0;
    for (var i = 0; i < goods.length; i++) {
      deliveryMoney = deliveryMoney * 1 + goods[i][0].deliveryMoney * 1;
    }
    this.setData({
      deliveryMoney: deliveryMoney
    });
    console.log(deliveryMoney);
    //合计费用
    let totalMoney = 0;
    for (var i = 0; i < goods.length; i++) {
      for (var k = 0; k < goods[i].length; k++) {
        totalMoney = totalMoney * 1 + goods[i][k].shopPrice * 1 * goods[i][k].shopNumber;
      }
    }
    let totalMoneys = totalMoney * 1 + deliveryMoney * 1;
    console.log(totalMoneys);
    this.setData({
      totalMoney: totalMoneys
    });
  },
  onShow() {
    this.setData({
      address: ''
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
              address: res.data.data[0]
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
      this.setData({
        address: app.globalData.address,
        showLoading: false
      });
    }
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //提交订单
  bindSubmit() {
    //判断是否是重复提交订单
    if (this.data.submit == true) {
      if (!this.data.address) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
      } else {
        this.setData({
          submit: false
        });
        //把数据封装后台成需要的json格式
        let shops = []; //商品信息数组
        for (var i = 0; i < this.data.goods.length; i++) {
          for (var k = 0; k < this.data.goods[i].length; k++) {
            shops = shops.concat({
              goodsId: this.data.goods[i][k].goodsId, //商品ID
              goodsAttrId: this.data.goods[i][k].shopGuiId, //可改变价格的规格ID
              goodsCnt: this.data.goods[i][k].shopNumber, //商品数量
              goodsAttr: this.data.goods[i][k].guigeArray, //不可改变价格的规格名称
            });
          }
        }
        //把数组转化为json
        let shopJson = JSON.stringify(shops);
        //选择的地址ID
        let addressId = this.data.address.addressId;
        //备注信息
        let remarks = this.data.remark;
        console.log(shops, addressId, userId, remarks);
        this.setData({
          showLoading: true
        });
        //下单支付接口
        wx.request({
          method: 'POST',
          url: `${app.globalData.api}Orders/submitOrder`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            userId: userId,
            consigneeId: addressId,
            remarks: remarks,
            goodsData: shopJson
          },
          success: res => {
            console.log(res);
            console.log({
              userId: userId,
              consigneeId: addressId,
              remarks: remarks,
              goodsData: shopJson
            });
            this.setData({
              showLoading: false
            });
            if (res.data.status == 1) {
              //发起微信支付
              wx.requestPayment({
                timeStamp: res.data.timeStamp.toString(),
                nonceStr: res.data.nonceStr,
                paySign: res.data.paySign,
                package: res.data.package,
                signType: 'MD5',
                success: res => {
                  //console.log(res);
                  //支付成功后
                  if (res.errMsg == 'requestPayment:ok') {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1500
                    });
                    //删除购物车商品
                    if (types == 1) {
                      //从缓存中取出商品
                      wx.getStorage({
                        key: 'shoppingCat',
                        success: res => {
                          console.log(res.data);
                          //缓存里的数组
                          let shops = res.data ? JSON.parse(res.data) : [];
                          console.log(shops);
                          console.log(this.data.goods);
                          //订单结算的数组
                          let goods = [];
                          for (var i = 0; i < this.data.goods.length; i++) {
                            goods = goods.concat(this.data.goods[i]);
                          }
                          console.log(goods);
                          //判断goodsId是否相同 如果相同就删除
                          for (var i = 0; i < shops.length; i++) {
                            for (var k = 0; k < goods.length; k++) {
                              if (shops[i].goodsId == goods[k].goodsId && shops[i].shopGui == goods[k].shopGui && shops[i].guigeArray == goods[k].guigeArray) {
                                shops.splice(i, 1);
                              }
                            }
                          }
                          console.log(shops);
                          wx.setStorage({
                            key: "shoppingCat",
                            data: JSON.stringify(shops)
                          });
                        }
                      });
                    }
                    setTimeout(res => {
                      wx.redirectTo({
                        url: '../orderList/orderList'
                      })
                    }, 500);
                  } else {
                    //支付失败后
                    this.setData({
                      submit: true
                    });
                    wx.showToast({
                      title: '网络异常',
                      icon: 'none',
                      duration: 1500
                    });
                  }
                },
                fail: res => {
                  this.setData({
                    showLoading: true
                  });
                  //取消支付
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    //删除购物车商品
                    if (types == 1) {
                      //从缓存中取出商品
                      wx.getStorage({
                        key: 'shoppingCat',
                        success: res => {
                          console.log(res.data);
                          //缓存里的数组
                          let shops = res.data ? JSON.parse(res.data) : [];
                          console.log(shops);
                          console.log(this.data.goods);
                          //订单结算的数组
                          let goods = [];
                          for (var i = 0; i < this.data.goods.length; i++) {
                            goods = goods.concat(this.data.goods[i]);
                          }
                          console.log(goods);
                          //判断goodsId是否相同 如果相同就删除
                          for (var i = 0; i < shops.length; i++) {
                            for (var k = 0; k < goods.length; k++) {
                              if (shops[i].goodsId == goods[k].goodsId && shops[i].shopGui == goods[k].shopGui && shops[i].guigeArray == goods[k].guigeArray) {
                                shops.splice(i, 1);
                              }
                            }
                          }
                          console.log(shops);
                          wx.setStorage({
                            key: "shoppingCat",
                            data: JSON.stringify(shops)
                          });
                        }
                      });
                    }
                    setTimeout(res => {
                      wx.redirectTo({
                        url: '../orderList/orderList'
                      })
                    }, 100);
                  }
                }
              });
            } else {
              //接口状态错误
              this.setData({
                submit: true
              });
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500
              });
            }
          },
          fail: res => {
            this.setData({
              submit: true,
              showLoading: false
            });
            console.log(res);
          }
        });
      }
    }
  },
  //备注信息
  bindText(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  //点击跳转店铺详情
  bindShops(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    })
  },
  //点击跳转地址列表
  bindAddress() {
    wx.navigateTo({
      url: '../address/address?type=1'
    })
  },
});
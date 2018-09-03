// pages/orderList/orderList.js
const app = getApp();
let userId;
Page({

  data: {
    lists: [], //分类导航
    listIndex: 0, //分类导航的下标
    currPage: 1, //当前页数
    totalPage: '', //总页数
    datas: [], //商品信息
    showLoading: true, //加载中动画
    baseUrl: app.globalData.baseUrl, //图片路径
  },

  onLoad: function(options) {
    console.log(options);
    //获取userId和userInfo
    userId = wx.getStorageSync('userId');
    if (options.nav) {
      this.setData({
        listIndex: options.nav
      });
    }
    let orderNav = [{ name: "全部", nameId: "-2,0,1,2,3,4,-3" },
      { name: "待付款", nameId: "-2" },
      { name: "待收货", nameId: "0,1,2,3" },
      { name: "已完成", nameId: "4" },
      { name: "退款中", nameId: "-3" }];
    this.setData({
      lists: orderNav
    });
  },
  onShow() {
    this.setData({
      currPage: 1, //当前页数
      totalPage: '', //总页数
      datas: [], //商品信息
    });
    this.getLists();
  },
  //点击分类导航
  bindNav(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      listIndex: index,
      currPage: 1, //当前页数
      totalPage: '', //总页数
      datas: [], //商品信息
      showLoading: true
    });
    this.getLists();
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //商品接口地址
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Orders/queryByPage`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        orderStatus: this.data.lists[this.data.listIndex].nameId,
        p: this.data.currPage,
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.root),
          totalPage: res.data.totalPage,
          currPage: res.data.currPage,
          showLoading: false,
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //取消订单
  bindCancel(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '温馨提示',
      content: '您是否要取消该订单',
      success: res => {
        if (res.confirm) {
          this.setData({
            showLoading: true
          });
          console.log('用户点击确定');
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Orders/orderCancel`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: userId,
              orderId: orderid
            },
            success: res => {
              console.log(res);
              this.setData({
                showLoading: false
              });
              if (res.data.status == 1) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(res => {
                  this.setData({
                    datas: [], //商品信息
                    currPage: 1, //当前页数
                    totalPage: '', //总页数
                  });
                  this.getLists();
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
  //继续付款
  bindPayment(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    //发起支付
    //支付成功后
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Orders/payNow`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        orderId: orderid
      },
      success: res => {
        console.log(res);
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
              setTimeout(res => {
                this.setData({
                  datas: [], //商品信息
                  currPage: 1, //当前页数
                  totalPage: '', //总页数
                });
                this.getLists();
              }, 500);
            } else {
              wx.showToast({
                title: '网络异常',
                icon: 'none',
                duration: 1500
              });
            }
          },
          fail: res => {
            //取消支付
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '取消支付',
                icon: 'none',
                duration: 1500
              });
            }
          }
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //确认收货
  bindReceipt(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '温馨提示',
      content: '您是否收到该商品,收货后增加' + this.data.datas[index].orderScore + '积分',
      success: res => {
        if (res.confirm) {
          this.setData({
            showLoading: true
          });
          console.log('用户点击确定');
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Orders/orderConfirm`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: userId,
              orderId: orderid
            },
            success: res => {
              console.log(res);
              this.setData({
                showLoading: false
              });
              if (res.data.stauts == 1) {
                wx.showToast({
                  title: '收货成功,增加' + this.data.datas[index].orderScore + '积分',
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(res => {
                  this.setData({
                    datas: [], //商品信息
                    currPage: 1, //当前页数
                    totalPage: '', //总页数
                  });
                  this.getLists();
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
  //删除订单
  bindDelete(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '温馨提示',
      content: '您是否要删除该订单',
      success: res => {
        if (res.confirm) {
          this.setData({
            showLoading: true
          });
          console.log('用户点击确定');
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}Orders/deleteOrder`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: userId,
              orderId: orderid,
            },
            success: res => {
              console.log(res);
              this.setData({
                showLoading: false
              });
              if (res.data.status == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(res => {
                  this.setData({
                    datas: [], //商品信息
                    currPage: 1, //当前页数
                    totalPage: '', //总页数
                  });
                  this.getLists();
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
  //去评价
  bindEvaluate(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    let length = e.currentTarget.dataset.length;
    let goodsid = e.currentTarget.dataset.goodsid;
    if (length > 1) {
      wx.navigateTo({
        url: `../evaluatelist/evaluatelist?orderid=${orderid}&goodsid=${goodsid}`
      });
    } else {
      wx.navigateTo({
        url: `../submitevaluate/submitevaluate?orderid=${orderid}&goodsid=${goodsid}`
      });
    }
  },
  //申请退款
  bindRefund(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../orderRefund/orderRefund?orderid=${orderid}`
    });
  },
  //跳转店铺
  bindtapMall(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //跳转订单详情
  bindShops(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../orderDetails/orderDetails?orderid=${orderid}`
    });
  },
  //上拉加载下一页
  onReachBottom() {
    if (this.data.currPage * 1 < this.data.totalPage * 1) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.setData({
        showLoading: true
      });
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
});
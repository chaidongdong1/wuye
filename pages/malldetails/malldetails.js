// pages/malldetails/malldetails.js
const app = getApp();
let userId, shopsId, catid;
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片
    showLoading: true, //加载动画
    masktop: '', //是否显示商品分类
    currPage: 1, //当前页数
    totalPage: '', //总页数
    mall: '', //店铺信息
    datas: [], //商品数组
    collect: '', //判断店铺是否已经被收藏(1是已收藏 0是未收藏)
    mallLists: [], //店铺分类接口
    index: '', //选择商品分类的下标
  },

  onLoad: function(options) {
    shopsId = options.shopid;
    userId = wx.getStorageSync('userId');
    console.log(options);
    //店铺信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Shops/getShopsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        shopId: shopsId,
      },
      success: res => {
        console.log(res);
        this.setData({
          mall: res.data.data.root[0],
        });
        console.log(this.data.mall)
      },
      fail: res => {
        console.log(res);
      }
    });
    //判断是否收藏了该店铺
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Favorites/checkFavorite`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        id: shopsId,
        type: 1,
      },
      success: res => {
        console.log({
          userId: userId,
          id: shopsId,
          type: 1,
        })
        console.log(res);
        if (res.data.stauts == 1) {
          this.setData({
            collect: res.data.data
          });
          console.log(res.data.data)
        }
      },
      fail: res => {
        console.log(res);
      }
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
  //点击联系商家
  bindPhone() {
    if (this.data.mall.shopTel) {
      wx.makePhoneCall({
        phoneNumber: this.data.mall.shopTel
      });
    } else {
      wx.showToast({
        title: '该店铺暂无联系方式',
        icon: 'none',
        duration: 1500
      });
    }
  },
  //获取商品信息接口
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Shops/getShopsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        shopId: shopsId,
        shopCatId1: this.data.mallLists.length == 0 ? ' ' : catid,
        cnt: 10,
        p1: this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.data.root[0].goodsList.root),
          currPage: res.data.data.root[0].goodsList.currPage,
          totalPage: res.data.data.root[0].goodsList.totalPage,
          showLoading: false,
        });
        console.log(this.data.datas);
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击收藏店铺
  bindtapCollect() {
    console.log(this.data.collect)
    if (this.data.collect == 1) {
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
    } else {
      this.setData({
        showLoading: true
      });
      //未收藏，点击后变为已收藏
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}Favorites/favorites`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          shopId: shopsId,
          userId: userId,
        },
        success: res => {
          console.log({
            shopId: shopsId,
            userId: userId,
          });
          this.setData({
            showLoading: false
          });
          console.log(res);
          if (res.data.stauts == 1) {
            this.setData({
              collect: 1
            });
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1500
            });
          } else {
            wx.showToast({
              title: '收藏失败',
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
            title: '收藏失败',
            icon: 'none',
            duration: 1500
          });
        }
      });
    }
  },
  //显示店铺商品分类
  bindClass() {
    this.setData({
      masktop: 0,
    });
    this.setData({
      showLoading: true,
    });
    //获取店铺分类接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}shopsCats/queryByList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        shopId: shopsId,
        type: 'pid',
      },
      success: res => {
        this.setData({
          showLoading: false
        });
        console.log(res);
        if (res.data.stauts == 1) {
          res.data.data.unshift({ "catId": "", "catName": "全部商品" });
          this.setData({
            mallLists: res.data.data
          });
          console.log(this.data.mallLists);
        } else {
          wx.showToast({
            title: '店铺分类获取失败',
            icon: 'none',
            duration: 1500
          });
        }
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //搜索跳转
  // bindtapSeek() {
  //   wx.navigateTo({
  //     url: `../seek/seek?seektype=1`
  //   });
  // },
  //点击跳转商品详情
  bindtapShopdetail(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //点击分类筛选商品
  bindtapLists(e) {
    console.log(e);
    catid = e.currentTarget.dataset.catid;
    let index = e.currentTarget.dataset.index;
    this.setData({
      datas: [],
      currPage: 1,
      totalPage: '',
      index: index
    });
    this.setData({
      showLoading: true,
    });
    this.getLists();
    this.bindClose();
  },
  //关闭分类
  bindClose() {
    this.setData({
      masktop: '-2000rpx',
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
        showLoading: true,
      });
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
});
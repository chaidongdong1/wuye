// pages/seek/seek.js
const app = getApp();
let history, inputs;
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    hotSeek: [], //热搜商品
    inputValue: '', //input的value值
    currPage: 1, //当前页数
    totalPage: '', //总页数
    shops: [], //商品列表
    shopNone: true, //判断否显示热搜和历史搜索
    shopTitle: ['商品', '店铺', '品牌'], //搜索的分类
    shopTitleIndex: 0, //搜索分类的下标
    showLoading: true, //加载动画
    pastSeek: [], //历史搜索
  },

  onLoad: function(options) {
    console.log(this.data.pastSeek);
    //热搜列表
    wx.request({
      url: `${app.globalData.api}index/loadConfigs`,
      success: res => {
        console.log(res);
        this.setData({
          hotSeek: res.data.data.hotSearchs,
          showLoading: false
        });
        console.log(this.data.hotSeek);
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //获取缓存的东西
  onShow() {
    var pastSeek = wx.getStorageSync('history');
    this.setData({
      pastSeek: pastSeek
    });
    if (!pastSeek || pastSeek.length == 0) {
      history = [];
    } else {
      history = pastSeek;
    }
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //input输入框，输入的内容
  bindInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
    if (!this.data.inputValue) {
      this.setData({
        currPage: 1, //当前页数
        totalPage: '', //总页数
        shops: [], //商品列表
        shopNone: true
      });
    }
  },
  //点击搜索按钮
  bindtapSeek() {
    if (!this.data.inputValue) {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      });
    } else {
      this.setData({
        currPage: 1, //当前页数
        totalPage: '', //总页数
        shops: [], //商品列表
      });
      this.getLists();
    }
  },
  //历史搜索
  bindtapPast(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      inputValue: item,
      shopNone: false,
    });
    this.getLists();
  },
  //商品搜索结果
  getLists() {
    this.setData({
      showLoading: true
    });
    //把搜索的内容存入缓存
    console.log(this.data.inputValue);
    inputs = this.data.inputValue;
    if (this.data.pastSeek.length != 0) {
      console.log('aaaa');
      //判断是否和缓存里的名字重复
      var shai = this.data.pastSeek.forEach(item => {
        if (item == inputs) {
          var itemNumber = this.data.pastSeek.indexOf(item);
          this.data.pastSeek.splice(itemNumber, 1);
          history = this.data.pastSeek;
        }
      });
    }
    //存入缓存
    history.unshift(this.data.inputValue);
    console.log(history)
    let historys = history.slice(0, 8);
    console.log(historys);
    wx.setStorageSync('history', historys);
    this.onShow();
    //搜索结果接口
    let jiekou = [{ goods: this.data.inputValue, p: this.data.currPage }, { shops: this.data.inputValue, p: this.data.currPage, cnt: 3 }, { brands: this.data.inputValue, p: this.data.currPage }];
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}index/searchAll`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: jiekou[this.data.shopTitleIndex],
      success: res => {
        console.log(res);
        this.setData({
          shops: this.data.shops.concat(res.data.data.root),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
          shopNone: false,
          showLoading: false
        });
        console.log(jiekou[this.data.shopTitleIndex]);
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击删除历史搜素
  bindtapDelete() {
    wx.showModal({
      title: '温馨提示',
      content: '您是否删除历史搜素',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          this.setData({
            showLoading: true
          });
          wx.removeStorageSync('history');
          setTimeout(res => {
            this.setData({
              showLoading: false
            });
            setTimeout(res => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              });
              this.onShow();
            }, 100);
          }, 300);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //点击分类导航
  bindtapShopTitle(e) {
    console.log(e);
    if (!this.data.inputValue) {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      });
    } else {
      this.setData({
        shopTitleIndex: e.currentTarget.dataset.index,
        currPage: 1, //当前页数
        totalPage: '', //总页数
        shops: [], //商品列表
      });
      this.getLists();
    }
  },
  //点击热搜
  bindtapHot(e) {
    let indexs = e.currentTarget.dataset.index;
    this.setData({
      inputValue: this.data.hotSeek[indexs],
      shopNone: false,
    });
    this.getLists();
  },
  //点击跳转品牌列表
  bindtapBrand(e) {
    console.log(e);
    let brandid = e.currentTarget.dataset.brandid;
    wx.navigateTo({
      url: `../brandShop/brandShop?brandid=${brandid}`
    });
  },
  //点击跳转商品详情
  bindtapShopDetails(e) {
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //点击跳转店铺
  bindtapMall(e) {
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //上拉加载下一页
  onReachBottom() {
    if (this.data.currPage * 1 < this.data.totalPage * 1) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
});
// pages/mall/mall.js
const app = getApp();
let tiems = [],
  when = [],
  datas, setInter;
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    imgUrls: [], //大轮播图
    images: [], //小轮播图
    currPage: 1, //新品推荐分页页数
    totalPage: '', //新品推荐总页数
    newShop: [], //新品推荐商品
    getSelfShopId: '', //自营店铺ID
    showLoading: true, //加载动画
    seckill: [], //优惠秒杀
    times: [], //优惠秒杀倒计时
  },

  onLoad: function(options) {
    //首页大图banner
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}index/index`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cnt: 5
      },
      success: res => {
        console.log(res);
        this.setData({
          imgUrls: res.data.data.banner,
          images: res.data.data.banner1,
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    //查询自营店铺ID
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}index/loadConfigs`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        type: 'getSelfShopId',
      },
      success: res => {
        console.log(res);
        this.setData({
          getSelfShopId: res.data.data.selfShopId,
        });
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
  onShow() {
    //优惠秒杀
    wx.request({
      method: 'GET',
      url: `${app.globalData.api}Panics/index`,
      success: res => {
        console.log(res);
        datas = res.data.data.root.splice(0, 3);
        this.setData({
          seckill: datas
        });
        console.log(this.data.seckill);
        if (datas) {
          let date = new Date(); // 获取当前时间
          for (var i = 0; i < datas.length; i++) {
            tiems.splice(i, 1, Date.parse(datas[i].endTime) * 1 - Date.parse(date) * 1);
          }
          console.log(tiems)
          setInter = setInterval(res => { this.Times(); }, 1000);
        }
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  Times() {
    let date = new Date(); // 获取当前时间
    //结束时间减去当前时间
    //获取剩余时间的时间戳
    console.log('aaaa')
    for (var i = 0; i < datas.length; i++) {
      tiems.splice(i, 1, Date.parse(datas[i].endTime) * 1 - Date.parse(date) * 1);
    }
    //判断when数组里是否有到时间的商品
    //如果存在就删除该商品
    for (var i = 0; i < tiems.length; i++) {
      if (tiems[i] * 1 <= 0) {
        let datas = this.data.seckill;
        tiems.splice(i, 1);
        datas.splice(i, 1);
        this.setData({
          seckill: datas, //优惠秒杀
          times: tiems, //优惠秒杀倒计时
        });
      }
    }
    //把时间戳转化为天时分秒
    for (var i = 0; i < tiems.length; i++) {
      let t = parseInt(tiems[i] / 1000 / 60 / 60 / 24 % 30);
      let h = parseInt(tiems[i] / 1000 / 60 / 60 % 24);
      let m = parseInt(tiems[i] / 1000 / 60 % 60);
      let s = parseInt(tiems[i] / 1000 % 60);
      when.splice(i, 1, t + '天' + h + ':' + m + ':' + s);
    }
    this.setData({
      times: when
    });
  },
  //新品推荐
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Goods/getGoodsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        isAdminRecom: 1,
        cnt: 10,
        p: this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          newShop: this.data.newShop.concat(res.data.data.root),
          totalPage: res.data.data.totalPage,
          currPage: res.data.data.currPage,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
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
      clearInterval(setInter);
      this.onShow();
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
  //点击跳转秒杀商品详情
  bindMiaosha(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../shopDetails1/shopDetails1?id=${id}`
    });
  },
  //新品列表
  bindtapNewMore() {
    wx.navigateTo({
      url: '../newShop/newShop'
    });
  },
  //新品商品详情
  bindtapNew(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //跳转搜索
  bindtapSeek() {
    wx.navigateTo({
      url: '../seek/seek'
    })
  },
  //自营超市跳转
  bindtapZiying() {
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${this.data.getSelfShopId}`
    });
  },
  //优质店铺跳转
  bindtapShops() {
    wx.navigateTo({
      url: '../shoplist/shoplist'
    });
  },
  //优惠秒杀跳转
  bindtapSeckill() {
    wx.navigateTo({
      url: '../seckill/seckill'
    });
  },
  //品牌街跳转
  bindtapBrand() {
    wx.navigateTo({
      url: '../brand/brand'
    });
  },
  onHide() {
    clearInterval(setInter);
  },
  onUnload() {
    clearInterval(setInter);
  },
});
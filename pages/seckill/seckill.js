// pages/seckill/seckill.js
const app = getApp();
let tiems = [],
  when = [],
  datas, setInter;
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    seckill: [], //优惠秒杀
    times: [], //优惠秒杀倒计时
    totalPage: '', //总页数
    currPage: 1, //当前页数
    showLoading:true
  },

  onLoad: function(options) {
    tiems = [];
    this.getLists();
  },
  getLists() {
    //优惠秒杀
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Panics/index`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        p: this.data.currPage
      },
      success: res => {
        console.log(res);
        datas = res.data.data.root;
        this.setData({
          seckill: this.data.seckill.concat(datas),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
          showLoading:false
        });
        if (this.data.seckill) {
          let date = new Date(); // 获取当前时间
          for (var i = 0; i < this.data.seckill.length; i++) {
            tiems.splice(i, 1, Date.parse(this.data.seckill[i].endTime) * 1 - Date.parse(date) * 1);
          }
          console.log(tiems)
          setInter = setInterval(res => { this.Times(); }, 1000);
        }
        console.log(this.data.seckill);
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
    console.log('bbbbbb')
    for (var i = 0; i < this.data.seckill.length; i++) {
      tiems.splice(i, 1, Date.parse(this.data.seckill[i].endTime) * 1 - Date.parse(date) * 1);
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
        console.log(this.data.seckill);
        console.log(this.data.tiems);
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
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
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
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
  //点击跳转秒杀商品详情
  bindMiaosha(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../shopDetails1/shopDetails1?id=${id}`
    });
  },
  onHide() {
    clearInterval(setInter);
  },
  onUnload() {
    clearInterval(setInter);
  },
});
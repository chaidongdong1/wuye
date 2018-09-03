// pages/brand/brand.js
const app = getApp();
Page({

  data: {
    // array: ['全部','华为', '特步', '小米', '美的'],
    // index: 0,
    baseUrl: app.globalData.baseUrl, //图片路径
    showLoading:true,//加载中动画
    currPage: 1, //当前页数
    datas: [], //品牌数组
    totalPage: '', //总页数
  },

  onLoad: function(options) {
    this.getLists();
  },
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Brands/getBrandsList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        cnt: 20,
        p: this.data.currPage,
      },
      success: res => {
        console.log(res);
        this.setData({
          showLoading:false,
          datas: this.data.datas.concat(res.data.data.root),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
        });
      },
      fail: res => {
        console.log(res);
      }
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
        showLoading:true
      });
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
  //点击跳转品牌街列表
  bindtapShop(e){
    console.log(e);
    let brandid = e.currentTarget.dataset.brandid;
    let brandname = e.currentTarget.dataset.brandname;
    wx.navigateTo({
      url: `../brandShop/brandShop?brandid=${brandid}&brandname=${brandname}`
    });
  },
  //品牌分类
  // bindPickerChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },

})
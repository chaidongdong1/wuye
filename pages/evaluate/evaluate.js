// pages/evaluate/evaluate.js
const app = getApp();
let goodsId;
Page({

  data: {
    list: [], //导航
    listIndex: 0, //导航下标
    countNums: [], //评价数量数组
    datas: [], //评价数组
    totalPage: '', //总页数
    currPage: 1, //当前页数
    baseUrl: app.globalData.baseUrl + 'Data',
    showLoading: true,
    goodsScore: ['', '5', '3,4', '1,2'],
  },

  onLoad: function(options) {
    console.log(options);
    goodsId = options.goodsid;
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}GoodsAppraises/getByAppraisesCnt`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        goodsId: goodsId
      },
      success: res => {
        console.log(res);
        let arry = [];
        let countNums = res.data.data[0];
        console.log(countNums)
        arry = [countNums.count, countNums.good, countNums.middle, countNums.diff];
        console.log(arry)
        for (var i = 0; i < arry.length; i++) {
          if (arry[i] == '' || arry[i] == null) {
            console.log(i);
            arry.splice(i, 1, 0);
          }
        }
        console.log(arry);
        this.setData({
          countNums: arry
        });
        let list = [{ name: "全部", namdId: "5,4,3,2,1", nameNumber: this.data.countNums[0] },
          { name: "好评", namdId: "5", nameNumber: this.data.countNums[1] },
          { name: "中评", namdId: "4,3", nameNumber: this.data.countNums[2] },
          { name: "差评", namdId: "2,1", nameNumber: this.data.countNums[3] }];
        this.setData({
          list: list
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    this.getLists();
  },
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}GoodsAppraises/getGoodsAppraisesList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        goodsId: goodsId,
        goodsScore: this.data.goodsScore[this.data.listIndex],
        p: this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.data.root),
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
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //点击导航
  bindNav(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      listIndex: index,
      datas: [], //评价数组
      totalPage: '', //总页数
      currPage: 1, //当前页数
      showLoading: true
    });
    this.getLists();
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
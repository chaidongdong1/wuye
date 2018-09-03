// pages/community/community.js
const app = getApp();
Page({
  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    datas: [], //社区活动列表
    currPage: 1, //当前页数
    totalPage: '', //总页数
    showLoading: true, //加载动画
  },

  onLoad: function(options) {
    this.getLists();
  },
  getLists() {
    //社区活动列表
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}index/getArticleList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        catId: 3,
        cnt: 10,
        p: this.data.currPage,
      },
      success: res => {
        console.log(res);
        let lists = res.data.data[0].articleChildList.root.map(item => {
          item.createTime = item.createTime.slice(0, 10);
          return item;
        });
        this.setData({
          showLoading: false,
          datas: this.data.datas.concat(lists),
          currPage: res.data.data[0].articleChildList.currPage,
          totalPage: res.data.data[0].articleChildList.totalPage,
        });
        console.log(this.data.datas);
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
  //跳转新闻详情
  bindtapCom(e) {
    console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&catid=3`
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
})
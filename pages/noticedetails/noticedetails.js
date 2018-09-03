// pages/noticedetails/noticedetails.js
const app = getApp();
Page({

  data: {
    title: '', //标题
    time: '',  //时间
    catid: '',  //类型
    nodes:'',//详情
    showLoading:true
  },

  onLoad: function(options) {
    console.log(options);
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}index/getArticleList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        catId: options.catid,
        articleId: options.articleid,
        type: 'getArticle'
      },
      success: res => {
        console.log(res);
        this.setData({
          title: res.data.data.articleTitle,
          time: res.data.data.createTime,
          catid: res.data.data.catId,
          nodes:res.data.data.articleContent,
          showLoading:false
        });
        console.log(this.data.nodes)
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
})
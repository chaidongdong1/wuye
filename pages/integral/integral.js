// pages/integral/integral.js
const app = getApp();
let setTime, interval, varName, userId, numbers;
var ctx = wx.createCanvasContext('canvasArcCir');
Page({

  data: {
    number: 0, //积分数量
    datas: [], //积分信息
    currPage: 1, //当前页数
    totalPage: '', //总页数
    showLoading: true
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId')
    //获取积分信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Users/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId
      },
      success: res => {
        console.log(res);
        wx.stopPullDownRefresh();
        numbers = res.data.data.userScore;
        if (numbers >= 25) {
          setTime = setInterval(() => {
            if (this.data.number < numbers) {
              let number = Math.round(this.data.number + numbers * 1 / 25);
              this.setData({
                number: number
              });
            } else {
              this.setData({
                number: numbers
              });
              console.log('停止')
              clearInterval(setTime);
            }
          }, 50);
        } else {
          this.setData({
            number: numbers
          })
        }
        //canvas画布边框动画
        clearInterval(varName);

        function drawArc(s, e) {
          ctx.setFillStyle('white');
          ctx.clearRect(0, 0, 100, 100);
          ctx.draw();
          var x = 55,
            y = 55,
            radius = 52;
          ctx.setLineWidth(5);
          ctx.setStrokeStyle('#32EEBE');
          ctx.setLineCap('round');
          ctx.beginPath();
          ctx.arc(x, y, radius, s, e, false);
          ctx.stroke();
          ctx.draw();
        }
        var step = 1,
          startAngle = 1.5 * Math.PI,
          endAngle = 0;
        var animation_interval = 30,
          n = 50;
        var animation = function() {
          if (step <= n) {
            endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
            drawArc(startAngle, endAngle);
            step++;
          } else {
            clearInterval(varName);
          }
        };
        varName = setInterval(animation, animation_interval);
      },
      fail: res => {
        console.log(res);
      }
    });
    this.getLists();
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  getLists() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Users/getUserScoreList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        dataSrc: '1,6',
        p: this.data.currPage
      },
      success: res => {
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.data.root),
          currPage: res.data.data.currPage,
          totalPage: res.data.data.totalPage,
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //点击跳转订单详情
  bindOrder(e) {
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
  //下拉刷新
  onPullDownRefresh() {
    this.onLoad();
  }
});
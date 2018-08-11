// pages/integral/integral.js
let setTime;
var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');
Page({

  data: {
    number: 0, //积分数量
  },

  onLoad: function(options) {
    //数字动画
    let numbers = 25;
    if (numbers >= 25) {
      setTime = setInterval(() => {
        if (this.data.number < numbers) {
          let number = Math.round(this.data.number + numbers * 1 / 25);
          this.setData({
            number: number
          });
          console.log(this.data.number);
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
      console.log("1111111")
    };
    varName = setInterval(animation, animation_interval);
  },
  onReady: function() {
    //创建并返回绘图上下文context对象。
    // var cxt_arc = wx.createCanvasContext('canvasCircle');
    // cxt_arc.setLineWidth(6);
    // cxt_arc.setStrokeStyle('#eaeaea');
    // cxt_arc.setLineCap('round');
    // cxt_arc.beginPath();
    // cxt_arc.arc(0, 0, 96, 0, 2 * Math.PI, false);
    // cxt_arc.stroke();
    // cxt_arc.draw();
  },
})
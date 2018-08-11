// pages/repevaluate/repevaluate.js
Page({

  data: {
    dflist:[]//商品打分星星的列表
  },

  onLoad: function (options) {
   // 页面显示的时候显示灰色星星
    var huixx = [
    "../../images/hongxing.png",
    "../../images/hongxing.png",
    "../../images/hongxing.png",
    "../../images/hongxing.png",
    "../../images/hongxing.png"
    ];
    this.setData({
      dflist:huixx
    })
  },
  xxdj: function(e){
    // 点击星星创建数组红星和灰星星
     var redxx = [
    "../../images/hongxing.png",
    "../../images/hongxing.png",
    "../../images/hongxing.png",
    "../../images/hongxing.png",
    "../../images/hongxing.png"
    ];
    var huixx = [
    "../../images/huixing.png",
    "../../images/huixing.png",
    "../../images/huixing.png",
    "../../images/huixing.png",
    "../../images/huixing.png"
    ];
    console.log(e);
    // 获取点击星星的下标
    let index = e.target.dataset.index-0;
    console.log(index+1)
    // 截取红色星星
    var jredxx = redxx.splice(0,index+1);
    // 截取灰色星星
    var jhuixx = huixx.splice(index+1);
    // 组合星星，形成一个新的星星数组
    var xxx = jredxx.concat(jhuixx);
    this.setData({
      dflist: xxx
    })
  },
})
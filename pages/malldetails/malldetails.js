// pages/malldetails/malldetails.js
Page({

  data: {
    masktop:'',
  },

  onLoad: function (options) {
  
  },
  //显示商品分类
  bindClass(){
    this.setData({
      masktop:0,
    });
  },
  //关闭分类
  bindClose(){
    this.setData({
      masktop:'-2000rpx',
    });
  },
});
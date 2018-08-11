// pages/cart/cart.js
Page({

  data: {
    chao:false,     //判断超市是否全选
  },

  onLoad: function(options) {

  },
  //点击超市全选
  bindChao() {
    if (this.data.chao == false) {
      this.setData({
        chao: true
      });
    } else {
      this.setData({
        chao: false
      });
    }
  },
})
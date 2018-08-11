// pages/shopDetails/shopDetails.js
Page({

  data: {
    //遮罩层
    mask: {
      opacity: 0,
      display: 'none'
    },
    //弹窗
    returnDeposit: {
      translateY: 'translateY(1500px)',
      opacity: 1
    },
    numbers: 1, //商品数量
    swiperIndexs: 0, //商品详情和规格参数的下标
    imgUrls: ['../../images/shop-xq01.jpg', '../../images/shop-xq01.jpg'], //轮播图
  },

  onLoad: function (options) {
  
  },
  // 立即购买
  // buy_now() {
  //   wx.navigateTo({
  //     url: '../submitOrder/submitOrder',
  //   })
  // },
  //点击显示商品详情
  shopDetail() {
    this.setData({
      swiperIndexs: 0,
    })
  },
  //点击显示规格参数
  shopSize() {
    this.setData({
      swiperIndexs: 1,
    })
  },
   //商品数量减少
  bindtapJian() {
    if (this.data.numbers <= 1) {
      wx.showToast({
        title: '数量不能小于1',
        image: '../../images/warning.png',
        duration: 1500
      })
    } else {
      let numbersJian = this.data.numbers * 1 - 1;
      this.setData({
        numbers: numbersJian
      })
    }
  },
  //商品数量减少
  bindtapJia() {
    let numbersJia = this.data.numbers * 1 + 1;
    this.setData({
      numbers: numbersJia
    })
  },
  //弹窗显示
  bindtapMasks() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.display = 'block';
    this.setData({ mask });
    mask.opacity = 1;
    returnDeposit.translateY = 'translateY(0)';
    returnDeposit.opacity = 1;
    this.setData({ mask, returnDeposit });
  },
  //关闭弹窗
  bindtapClose() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.opacity = 0;
    returnDeposit.opacity = 0;
    this.setData({ mask, returnDeposit });
    setTimeout(() => {
      mask.display = 'none';
      returnDeposit.translateY = 'translateY(1500px)';
      this.setData({ mask, returnDeposit });
    }, 500);
  },
})
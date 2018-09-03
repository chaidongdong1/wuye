// pages/submitevaluate/submitevaluate.js
const app = getApp();
let userId, orderId, goodsId;
let listsHong = ['/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png'], //商品打分红
  listsHei = ['/images/huixing.png', '/images/huixing.png', '/images/huixing.png', '/images/huixing.png', '/images/huixing.png']; //商品打分黑
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    listShop: ['/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png'], //商品打分
    listShopIndex: 4, //商品打分下标(代表5星)
    listExpress: ['/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png'], //快递打分
    listExpressIndex: 4, //快递打分下标(代表5星)
    listServe: ['/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png', '/images/hongxing.png'], //快递打分
    listServeIndex: 4, //服务打分下标(代表5星)
    text: '', //商品评价
    datas: '', //商品数据
    temp: [], //评价上传的图片
    showLoading: true,
    imgs: [],
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId');
    console.log(options);
    orderId = options.orderid;
    goodsId = options.goodsid;
    //商品详情接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Orders/getOrderInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        goodsId: goodsId,
        orderId:orderId
      },
      success: res => {
        console.log({
          userId: userId,
          goodsId: goodsId
        })
        console.log(res);
        this.setData({
          datas: res.data.goodsList[0],
          showLoading: false
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //商品打分
  bindtapDafen(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      listShopIndex: index
    });
    let listZhong = listsHong.slice(0, index + 1);
    let listWei = listsHei.slice(0, (4 - index));
    console.log(listZhong);
    console.log(listWei);
    this.setData({
      listShop: listZhong.concat(listWei)
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //快递打分
  bindtapKuai(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      listExpressIndex: index
    });
    let listZhong = listsHong.slice(0, index + 1);
    let listWei = listsHei.slice(0, (4 - index));
    console.log(listZhong);
    console.log(listWei);
    this.setData({
      listExpress: listZhong.concat(listWei)
    });
  },
  //服务打分
  bindSever(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      listServeIndex: index
    });
    let listZhong = listsHong.slice(0, index + 1);
    let listWei = listsHei.slice(0, (4 - index));
    console.log(listZhong);
    console.log(listWei);
    this.setData({
      listServe: listZhong.concat(listWei)
    });
  },
  //评价
  bindText(e) {
    this.setData({
      text: e.detail.value
    });
  },
  //添加图片
  bindPhoto(e) {
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        var temp = this.data.temp;
        console.log(tempFilePaths);
        console.log(temp);
        if (index == -1) {
          console.log('111111');
          temp = temp.concat(tempFilePaths);
        } else {
          console.log("22222222");
          temp[index] = tempFilePaths[0];
        }
        this.setData({
          temp: temp
        });
        console.log(this.data.temp);
      }
    });
  },

  //提交评价
  bindSubmit() {
    if (!this.data.text) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none',
        duration: 1500
      })
    } else {
      var temp = this.data.temp;
      var len = temp.length;
      if (len == 0) {
        this.evalute();
      } else {
        var copy = temp.slice(0);
        for (var i = 0; i < len; i++) {
          var img = copy.shift();
          this.uploadImg(img);
        }
      }
    }
  },
  // 上传图片
  uploadImg(img) {
    wx.showLoading({
      title: '提交中',
    })
    console.log(img);
    wx.uploadFile({
      url: `${app.globalData.api}common/uploadGoodsPic`,
      filePath: img,
      name: 'file',
      formData: {
        userId: userId,
        'folder': 'apprise'
      },
      success: res => {
        console.log(res);
        let ress = JSON.parse(res.data);
        console.log(ress);
        wx.hideLoading();
        if (ress.status == 1) {
          var imgs = this.data.imgs;
          imgs.push(ress.data.Image);
          this.setData({
            imgs: imgs
          });
          var temp = this.data.temp;
          console.log(temp)
          console.log(imgs)
          var len0 = temp.length;
          var len = imgs.length;
          if (len == len0) {
            this.evalute();
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: ress.msg,
            icon: 'none',
            duration: 1500
          });
          console.log("上传失败")
        }
      }
    });
  },
  evalute() {
    console.log(this.data.datas)
    let temp = JSON.stringify(this.data.imgs).replace(/^\[{1}|\]{1}$/g, '').replace(/\"{1}/g, '');
    this.setData({
      showLoading: true
    });
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}GoodsAppraises/addGoodsAppraises`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        orderId: orderId,
        goodsId: this.data.datas.goodsId,
        goodsAttrId: this.data.datas.goodsAttrId, //规格ID
        goodsScore: this.data.listShopIndex + 1, //商品评分
        content: this.data.text, //评价内容
        timeScore: this.data.listExpressIndex + 1, //快递评分
        serviceScore: this.data.listServeIndex + 1, //服务评分
        appraiseAnnex: temp, //图片路径
      },
      success: res => {
        console.log(res);
        console.log({
          userId: userId,
          orderId: orderId,
          goodsId: this.data.datas.goodsId,
          goodsAttrId: this.data.datas.goodsAttrId, //规格ID
          goodsScore: this.data.listShopIndex, //商品评分
          content: this.data.text, //评价内容
          timeScore: this.data.listExpressIndex, //快递评分
          serviceScore: this.data.listServeIndex, //服务评分
          appraiseAnnex: temp, //图片路径
        });
        this.setData({
          showLoading: false
        });
        if (res.data.stauts == 1) {
          wx.showToast({
            title: "评价成功",
            icon: 'success',
            duration: 1500
          });
          setTimeout(res => {
            wx.navigateBack({
              delta: 1
            });
          }, 500);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: res => {
        this.setData({
          showLoading: false
        });
        console.log(res);
      }
    });
  },
});
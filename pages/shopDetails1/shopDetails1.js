// pages/shopDetails/shopDetails.js
const app = getApp();
let userId, shopMall, guigeArray, catShops, setInter, id;
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
    baseUrl: app.globalData.baseUrl, //图片路径
    numbers: 1, //商品数量
    swiperIndexs: 0, //商品详情和规格参数的下标
    imgUrls: [], //轮播图
    datas: '', //商品信息接口
    specifications: [], //规格参数数组
    attrs: [], //不可以改变价格的数组
    indexs: 0, //不可改变价格大数组的下标
    guiIndex: 0, //不可改变价格数小组的下标
    curChoosedAttr: [], //空数组，多规格选择
    tiems: '', //倒计时
    showLoading: true
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId');
    console.log(options);
    id = options.id;
  },
  onShow() {
    //商品详情接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Panics/getGoodsDetails`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        id: id,
      },
      success: res => {
        console.log(res);
        //判断该商品是否有规格，如果没有添加默认规格（不可以修改价格的数组）
        if (!res.data.list.attrs || res.data.list.attrs.length == 0) {
          let attr = [{
            "attrVal": "默认",
            "attrId": "-1",
            "attrName": "尺码",
            "attrContent": "默认",
            "opts": ["默认"]
            }];
          this.setData({
            attrs: attr,
            curChoosedAttr: attr.map(item => -1)
          });
        } else {
          //新增一个和不可修改价格的数组长度一致的数组
          //复制数组里的值为-1
          this.setData({
            attrs: res.data.list.attrs,
            curChoosedAttr: res.data.list.attrs.map(item => -1)
          });
        }
        //从接口里取得参数
        this.setData({
          imgUrls: res.data.list.gallery,
          datas: res.data.data,
          specifications: res.data.list.specifications,
          showLoading: false
        });
        setInter = setInterval(res => { this.Times(); }, 1000);
        console.log(this.data.curChoosedAttr);
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
  //倒计时
  Times() {
    let date = new Date(); // 获取当前时间
    let tiems = Date.parse(this.data.datas.endTime) * 1 - Date.parse(date) * 1;
    // console.log(tiems);
    let t = parseInt(tiems / 1000 / 60 / 60 / 24 % 30);
    let h = parseInt(tiems / 1000 / 60 / 60 % 24);
    let m = parseInt(tiems / 1000 / 60 % 60);
    let s = parseInt(tiems / 1000 % 60);
    let when = t + '天' + h + ':' + m + ':' + s;
    // console.log(when);
    this.setData({
      tiems: when
    });
  },
  //点击规格(循环的规格)
  bindGui(e) {
    console.log(e);
    //点击的是大数组的第几个
    let indexs = e.currentTarget.dataset.indexs;
    //点击的是小数组的第几个
    let guiIndex = e.currentTarget.dataset.index;
    console.log(indexs);
    let curChoosedAttr = this.data.curChoosedAttr;
    //改变复制数组的第indexs个的数值，为guiIndex
    curChoosedAttr[indexs] = guiIndex;
    console.log(guiIndex);
    this.setData({
      guiIndex: guiIndex,
      indexs: indexs,
      curChoosedAttr,
    });
    console.log(this.data.curChoosedAttr);

    //获取不可改变价格的规格
    //加购物车和购买时的规格参数(用于封装的catShops函数里)
    var attrs = this.data.attrs;
    console.log(this.data.curChoosedAttr);
    var len = curChoosedAttr.length;
    guigeArray = [];
    for (var i = 0; i < len; i++) {
      var k = curChoosedAttr[i];
      guigeArray.push(attrs[i].attrName + ':' + attrs[i].opts[k]);
    }
    console.log(guigeArray);
  },
  //点击跳转店铺
  bindtapMall(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.redirectTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //加入购物车之前重置数据结构
  catShops() {
    return {
      shopId: this.data.datas.shopId, //店铺ID
      shopName: this.data.datas.shopName, //店铺名称
      goodsId: this.data.datas.goodsId, //商品ID
      id: this.data.datas.id, //抢购商品id
      goodsName: this.data.datas.goodsName, //商品名字
      goodsImage: this.data.datas.goodsThums, //商品图片
      shopPrice: this.data.datas.panicMoney, //商品单价
      shopNumber: this.data.numbers, //商品数量
      deliveryMoney: this.data.datas.deliveryMoney, //快递费
      guigeArray: guigeArray.join(','), //规格数组
      goodsStock: this.data.datas.goodsStock, //商品库存
    };
  },
  //立即购买
  buy_now() {
    //判断是否已经选择规格
    let nuame = this.data.curChoosedAttr.findIndex(item => item == -1);
    if (nuame == -1) {
      //商品信息
      catShops = this.catShops();
      console.log(catShops);
      //把商品信息存入app.js
      app.globalData.goods = [[catShops]];
      wx.navigateTo({
        url: '../orderSubmit1/orderSubmit1'
      });
      this.bindtapClose();
    } else {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 1500
      });
    }
  },
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
  //点击跳转购物车
  bindCats() {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  //商品数量减少
  bindtapJian() {
    //判断数量是否小于1
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
  //商品数量增加
  bindtapJia() {
    let numbersJia = this.data.numbers * 1 + 1;
    //判断当前数量是否大于库存
    if (numbersJia > this.data.datas.goodsStock * 1) {
      wx.showToast({
        title: '库存不足，不能继续增加',
        icon: 'none',
        duration: 1500
      });
    } else {
      this.setData({
        numbers: numbersJia
      })
    }
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
    let attrss = this.data.attrs;
    console.log(attrss);
    //弹窗关闭后把模拟的数组重置一下
    //里面的数值全部改为-1
    this.setData({
      curChoosedAttr: attrss.map(item => -1),
      numbers: 1
    });
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
  onHide() {
    clearInterval(setInter);
  },
  onUnload() {
    clearInterval(setInter);
  },
});
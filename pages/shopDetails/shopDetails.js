// pages/shopDetails/shopDetails.js
const app = getApp();
let userId, shopMall, guigeArray,
  catShops;
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
    priceAttrName: '', //可以改变价格的数组名称
    priceAttrs: [], //可以改变价格的数组
    colorIndex: 0, //可修改价格的数组下标
    attrs: [], //不可以改变价格的数组
    indexs: 0, //不可改变价格大数组的下标
    guiIndex: 0, //不可改变价格数小组的下标
    curChoosedAttr: [], //空数组，多规格选择
    showLoading: true
  },

  onLoad: function(options) {
    userId = wx.getStorageSync('userId');
    console.log(options);
    //商品详情接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}Goods/getGoodsDetails`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,
        goodsId: options.goodsid,
      },
      success: res => {
        console.log(res);
        //判断该商品是否有规格，如果没有添加默认规格（可以修改价格的数组）
        if (!res.data.data.priceAttrs || res.data.data.priceAttrs == 0) {
          let price = [{
            "attrVal": "默认",
            "attrPrice": res.data.data.goodsDetails.shopPrice,
            "attrStock": res.data.data.goodsDetails.goodsStock,
            "attrId": "-1",
            "attrName": "颜色",
            }];
          console.log({
            "attrVal": "默认",
            "attrPrice": res.data.data.goodsDetails.shopPrice,
            "attrStock": res.data.data.goodsDetails.goodsStock,
            "attrId": "-1",
            "attrName": "颜色",
          });
          this.setData({
            priceAttrs: price,
            priceAttrName: "颜色",
          });
        } else {
          this.setData({
            priceAttrs: res.data.data.priceAttrs,
            priceAttrName: res.data.data.priceAttrName,
          });
        }
        //判断该商品是否有规格，如果没有添加默认规格（不可以修改价格的数组）
        if (!res.data.data.attrs || res.data.data.attrs.length == 0) {
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
            attrs: res.data.data.attrs,
            curChoosedAttr: res.data.data.attrs.map(item => -1)
          });
        }
        //从接口里取得参数
        this.setData({
          imgUrls: res.data.data.gallery,
          datas: res.data.data.goodsDetails,
          specifications: res.data.data.specifications,
          showLoading: false
        });
        console.log(this.data.curChoosedAttr)
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.applet,
      path: 'pages/start/start'
    };
  },
  //点击选择可修改价格的规格
  bindColor(e) {
    console.log(e);
    this.setData({
      colorIndex: e.currentTarget.dataset.index
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
      goodsName: this.data.datas.goodsName, //商品名字
      goodsImage: this.data.datas.goodsThums, //商品图片
      shopPrice: this.data.priceAttrs[this.data.colorIndex].attrPrice, //商品单价
      shopNumber: this.data.numbers, //商品数量
      deliveryMoney: this.data.datas.deliveryMoney, //快递费
      shopGui: this.data.priceAttrName + ':' + this.data.priceAttrs[this.data.colorIndex].attrVal, //可以改变价格的规格
      shopGuiId: this.data.priceAttrs[this.data.colorIndex].id, //可以改变价格的数组的ID
      guigeArray: guigeArray.join(','), //规格数组
      goodsStock: this.data.priceAttrs[this.data.colorIndex].attrStock, //商品库存
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
      if (catShops.goodsStock > 0) {
        //把商品信息存入app.js
        app.globalData.goods = [[catShops]];
        wx.navigateTo({
          url: '../orderSubmit/orderSubmit'
        });
        this.bindtapClose();
      } else {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 1500
        });
      }
    } else {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 1500
      });
    }
  },
  //点击加入购物车
  bindtapCat() {
    //判断是否已经选择规格
    let nuame = this.data.curChoosedAttr.findIndex(item => item == -1);
    if (nuame == -1) {
      if (this.data.priceAttrs[this.data.colorIndex].attrStock > 0) {
        console.log({
          shopId: this.data.datas.shopId, //店铺ID
          shopName: this.data.datas.shopName, //店铺名称
          goodsId: this.data.datas.goodsId, //商品ID
          goodsName: this.data.datas.goodsName, //商品名字
          goodsImage: this.data.datas.goodsThums, //商品图片
          shopPrice: this.data.datas.shopPrice, //商品单价
          shopNumber: this.data.numbers, //商品数量
          shopGui: this.data.priceAttrName + ':' + this.data.priceAttrs[this.data.colorIndex].attrVal, //可以改变价格的规格
          guigeArray: guigeArray.join(','), //规格数组
          goodsStock: this.data.priceAttrs[this.data.colorIndex].attrStock, //商品库存
        });
        //商品信息数组
        catShops = this.catShops();
        console.log(catShops);
        //从缓存中取出数组
        wx.getStorage({
          key: 'shoppingCat',
          //先查询缓存判断缓存里是否有该商品
          //如果购物车中已有商品
          success: res => {
            console.log(res);
            //取出缓存
            let shops = res.data ? JSON.parse(res.data) : [];
            console.log(shops);
            console.log(catShops.goodsId, catShops.shopGui, catShops.guigeArray);
            //判断购物车中是否有相同规格的商品
            let whetherSame = shops.findIndex(item => item.goodsId == catShops.goodsId && item.shopGui == catShops.shopGui && item.guigeArray == catShops.guigeArray)
            console.log(whetherSame);
            if (whetherSame == -1) {
              //如果没有则加入购物车
              //把当前的商品push到数组里
              shops.push(catShops);
              console.log(shops)
              //存入缓存
              wx.setStorage({
                key: "shoppingCat",
                data: JSON.stringify(shops)
              });
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500
              });
              //关闭弹窗
              setTimeout(() => {
                this.bindtapClose();
              }, 500);
            } else {
              //如果已经存在，则提示已经存在
              wx.showToast({
                title: '该商品已在购物车，请勿重复添加',
                icon: 'none',
                duration: 2000
              });
            }
          },
          //商品第一次加入购物车
          fail: err => {
            //如果执行失败，则证明用户第一次加入购物车
            //即缓存中没有cart数组
            console.log(err);
            //商品信息
            let catShop = [catShops];
            console.log(catShop);
            //存入缓存
            wx.setStorage({
              key: "shoppingCat",
              data: JSON.stringify(catShop)
            })
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500
            });
            //关闭弹窗
            setTimeout(() => {
              this.bindtapClose();
            }, 500);
          }
        })
      } else {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 1500
        });
      }
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
    if (numbersJia > this.data.priceAttrs[this.data.colorIndex].attrStock * 1) {
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
});
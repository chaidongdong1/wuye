// pages/cart/cart.js
const app = getApp();
let shops;
Page({

  data: {
    baseUrl: app.globalData.baseUrl, //图片路径
    datas: [], //店铺分类后的商品属性
    all: false, //全选
    totalMoney: 0, //合计总价
    datasList: 0, //总个数
    showLoading: true
  },

  onLoad: function(options) {

  },
  onShow() {
    setTimeout(res => {
      this.setData({
        showLoading: false
      });
    }, 500);
    this.setData({
      all: false,
      totalMoney: 0,
      datasList: 0,
    });
    //从缓存中取出商品
    wx.getStorage({
      key: 'shoppingCat',
      success: res => {
        console.log(res.data);
        shops = res.data ? JSON.parse(res.data) : [];
        //向商品数组里加入temp(控制单个商品选中),temps(控制店铺选中)
        shops = shops.map(res => {
          let temp = res;
          temp.temp = false;
          temp.temps = false;
          return temp;
        });
        console.log(shops);
        //判断缓存里的数组是否为空
        if (shops) {
          let shopc = [],
            shopArrey = [];
          //筛选出数组shops里的shopId(店铺ID)
          for (var i = 0; i < shops.length; i++) {
            shopArrey = shopArrey.concat(shops[i].shopId);
          }
          console.log(shopArrey);
          //去掉筛选出来重复的元素（当前店铺ID的数组）
          for (var i = 0; i < shopArrey.length; i++) {
            if (shopc.indexOf(shopArrey[i]) == -1) {
              shopc.push(shopArrey[i]);
            }
          }
          console.log(shopc);
          //把从缓存里取出的大数组通过店铺id分为多个小数组
          let shopArreys = shopc.map(item => (shops.filter(sub => (sub.shopId == item))));
          console.log(shopArreys)
          this.setData({
            datas: shopArreys
          });
        }
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
  //点击店铺全选
  bindChao(e) {
    console.log(e);
    //点击的是第几个店铺
    let index = e.currentTarget.dataset.index;
    let lists = this.data.datas;
    //判断当前店铺是否被选中
    let listtemp = lists[index].findIndex(item => item.temp == false);
    console.log(listtemp);
    if (listtemp == -1) { //已经全选，改为全不选
      lists[index].map(item => {
        let temp = item;
        temp.temp = false;
        temp.temps = false;
        return temp;
      });
      console.log(lists[index])
      //计算总价和数量
      let MoneyList = lists.map(item => item.filter(res => res.temp == true));
      console.log(MoneyList)
      let moneys = 0;
      let number = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        number = number * 1 + MoneyList[i].length;
        for (var k = 0; k < MoneyList[i].length; k++) {
          moneys = moneys * 1 + MoneyList[i][k].shopPrice * 1 * MoneyList[i][k].shopNumber * 1;
        }
      }
      console.log(moneys)
      this.setData({
        datas: lists,
        all: false,
        totalMoney: moneys,
        datasList: number
      });
    } else { //没有全选改为全选
      lists[index].map(item => {
        let temp = item;
        temp.temp = true;
        temp.temps = true;
        return temp;
      });
      console.log(lists[index])
      //计算总价和数量
      let MoneyList = lists.map(item => item.filter(res => res.temp == true));
      console.log(MoneyList)
      let moneys = 0;
      let number = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        number = number * 1 + MoneyList[i].length;
        for (var k = 0; k < MoneyList[i].length; k++) {
          moneys = moneys * 1 + MoneyList[i][k].shopPrice * 1 * MoneyList[i][k].shopNumber * 1;
        }
      }
      console.log(moneys)
      this.setData({
        datas: lists,
        totalMoney: moneys,
        datasList: number
      });
      //底部全选按钮是否选中
      let listIndex = lists.findIndex(item => item.findIndex(res => res.temp == true && res.temps == true));
      console.log(listIndex);
      if (listIndex == -1) {
        this.setData({
          all: true
        });
      } else {
        this.setData({
          all: false
        });
      }
    }
    console.log(lists)
  },
  //点击选中单个商品
  bindGoodsxuan(e) {
    //大数组的index值
    let shops = e.currentTarget.dataset.shops;
    //里面小数组的index值
    let index = e.currentTarget.dataset.index;
    let lists = this.data.datas;
    //单个商品里的temp是否被选中
    lists[shops][index].temp = !lists[shops][index].temp;
    this.setData({
      datas: lists
    });
    //判断该店铺所有商品是否被选中
    let listtemp = lists[shops].findIndex(item => item.temp == false);
    console.log(listtemp);
    if (listtemp == -1) {
      //没有选中，改为选中（店铺全选）
      lists[shops].map(item => {
        let temp = item;
        temp.temps = true;
        return temp;
      });
      //计算总价和数量
      let MoneyList = lists.map(item => item.filter(res => res.temp == true));
      console.log(MoneyList);
      let moneys = 0;
      let number = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        number = number * 1 + MoneyList[i].length;
        for (var k = 0; k < MoneyList[i].length; k++) {
          moneys = moneys * 1 + MoneyList[i][k].shopPrice * 1 * MoneyList[i][k].shopNumber * 1;
        }
      }
      console.log(moneys)
      this.setData({
        datas: lists,
        totalMoney: moneys,
        datasList: number
      });
      //底部全选按钮是否选中
      let listIndex = lists.findIndex(item => item.findIndex(res => res.temp == true && res.temps == true));
      console.log(listIndex);
      if (listIndex == -1) {
        this.setData({
          all: true
        });
      } else {
        this.setData({
          all: false
        });
      }
    } else {
      //已经选中改为未选中（店铺全选）
      lists[shops].map(item => {
        let temp = item;
        temp.temps = false;
        return temp;
      });
      //计算总价和数量
      let MoneyList = lists.map(item => item.filter(res => res.temp == true));
      console.log(MoneyList)
      let moneys = 0;
      let number = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        number = number * 1 + MoneyList[i].length * 1;
        for (var k = 0; k < MoneyList[i].length; k++) {
          moneys = moneys * 1 + MoneyList[i][k].shopPrice * 1 * MoneyList[i][k].shopNumber * 1;
        }
      }
      console.log(moneys)
      console.log(number)
      this.setData({
        datas: lists,
        all: false,
        totalMoney: moneys,
        datasList: number
      });
    }
    console.log(lists);
  },
  //全选按钮
  bindtapAll() {
    let lists = this.data.datas;
    //判断全选按钮是否被选中
    let listIndex = lists.findIndex(item => item.findIndex(res => res.temp == true && res.temps == true));
    console.log(listIndex);
    if (listIndex == -1) {
      //已经全选了，改为不全选（全选按钮）
      lists.map(item => item.map(res => {
        let temp = res;
        temp.temps = false;
        temp.temp = false;
        return temp;
      }));
      //计算总价和数量
      let MoneyList = lists.map(item => item.filter(res => res.temp == true));
      console.log(MoneyList)
      let moneys = 0;
      let number = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        number = number * 1 + MoneyList[i].length;
        for (var k = 0; k < MoneyList[i].length; k++) {
          moneys = moneys * 1 + MoneyList[i][k].shopPrice * 1 * MoneyList[i][k].shopNumber * 1;
        }
      }
      console.log(moneys)
      this.setData({
        datas: lists,
        all: false,
        totalMoney: moneys,
        datasList: number
      });
    } else {
      //没有全选，改为全选（全选按钮）
      lists.map(item => item.map(res => {
        let temp = res;
        temp.temps = true;
        temp.temp = true;
        return temp;
      }));
      //计算总价和数量
      let MoneyList = lists.map(item => item.filter(res => res.temp == true));
      console.log(MoneyList)
      let moneys = 0;
      let number = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        number = number * 1 + MoneyList[i].length;
        for (var k = 0; k < MoneyList[i].length; k++) {
          moneys = moneys * 1 + MoneyList[i][k].shopPrice * 1 * MoneyList[i][k].shopNumber * 1;
        }
      }
      console.log(moneys)
      this.setData({
        datas: lists,
        all: true,
        totalMoney: moneys,
        datasList: number
      });
    }
  },
  //点击数量减少
  bindJian(e) {
    console.log(e);
    //点击的是第几个店铺
    let shopindex = e.currentTarget.dataset.shopindex;
    //点击的是第几个商品
    let goodsindex = e.currentTarget.dataset.goodsindex;
    let lists = this.data.datas;
    //判断当前数量是否小于1
    if (lists[shopindex][goodsindex].shopNumber > 1) {
      lists[shopindex][goodsindex].shopNumber--; //数量自减
      this.setData({
        datas: lists,
      });
      if (lists[shopindex][goodsindex].temp == true) {
        //计算总价
        let moneys = this.data.totalMoney * 1 - lists[shopindex][goodsindex].shopPrice * 1;
        this.setData({
          totalMoney: moneys
        });
      }
      console.log(this.data.datas);
      //把多个数组转化为一个数组存入缓存
      let data = [];
      for (var i = 0; i < lists.length; i++) {
        data = data.concat(lists[i]);
      }
      console.log(data);
      wx.setStorage({
        key: "shoppingCat",
        data: JSON.stringify(data)
      })
    } else {
      wx.showToast({
        title: '数量不能小于1',
        icon: 'none',
        duration: 1500
      })
    }
  },
  //点击增加数量按钮
  bindJia(e) {
    console.log(e);
    //点击的是第几个店铺
    let shopindex = e.currentTarget.dataset.shopindex;
    //点击的是第几个商品
    let goodsindex = e.currentTarget.dataset.goodsindex;
    let lists = this.data.datas;
    //判断当前数量是否大于库存
    if (lists[shopindex][goodsindex].shopNumber < lists[shopindex][goodsindex].goodsStock) {
      lists[shopindex][goodsindex].shopNumber++; //商品数量自增
      this.setData({
        datas: lists
      });
      console.log(this.data.datas);
      if (lists[shopindex][goodsindex].temp == true) {
        //计算总价
        let moneys = this.data.totalMoney * 1 + lists[shopindex][goodsindex].shopPrice * 1;
        this.setData({
          totalMoney: moneys
        });
      }
      //把多个数组转化为一个数组存入缓存
      let data = [];
      for (var i = 0; i < lists.length; i++) {
        data = data.concat(lists[i]);
      }
      console.log(data);
      wx.setStorage({
        key: "shoppingCat",
        data: JSON.stringify(data)
      })
    } else {
      wx.showToast({
        title: '库存不足，不能继续增加',
        icon: 'none',
        duration: 1500
      })
    }
  },
  //删除商品
  bindDelete() {
    let list = this.data.datas;
    //判断是否选择商品
    let listIndex = list.findIndex(item => item.findIndex(res => res.temp == true) != -1);
    console.log(listIndex);
    if (listIndex == -1) {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '是否要删除该商品？',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            this.setData({
              showLoading: true
            });
            console.log(list);
            var len0 = list.length;
            console.log(len0);
            //删除选中的商品
            //循环大数组
            for (var i = 0; i < len0; i++) {
              var len = list[i].length;
              console.log(len);
              //循环小数组
              for (var k = 0; k < len; k++) {
                //判断每个商品里的temp是否被选中
                if (list[i][k].temp == true) {
                  list[i].splice(k, 1);
                  k--;
                  len--;
                }
              }
              //判断商品数组（小数组）是否为空
              //如果小数组为空，则删除该数组
              if (len == 0) {
                list.splice(i, 1);
                len0--;
                i--;
              }
            }
            console.log(list);

            this.setData({
              datas: list
            });
            //存入缓存
            let data = [];
            for (var i = 0; i < list.length; i++) {
              data = data.concat(list[i]);
            }
            console.log(data);
            wx.setStorage({
              key: "shoppingCat",
              data: JSON.stringify(data)
            });
            setTimeout(res => {
              this.setData({
                showLoading: false
              });
              setTimeout(res => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                });
                this.onShow();
              }, 100);
            }, 300);
            console.log(this.data.datas)
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }
  },
  //点击结算按钮
  bindSumbit() {
    let list = this.data.datas;
    //判断是否选择商品
    let listIndex = list.findIndex(item => item.findIndex(res => res.temp == true) != -1);
    console.log(listIndex);
    if (listIndex == -1) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 1500
      });
    } else {
      //把选中的商品提取出来
      let lists = [];
      for (var i = 0; i < list.length; i++) {
        for (var k = 0; k < list[i].length; k++) {
          if (list[i][k].temp == true) {
            lists = lists.concat(list[i][k]);
          }
        }
      }
      console.log(lists);
      //把选中的商品的店铺ID提取出来
      let shopId = [];
      for (var i = 0; i < lists.length; i++) {
        shopId = shopId.concat(lists[i].shopId);
      }
      console.log(shopId);
      //去掉重复的提取出来的店铺ID
      let shopkN = [];
      for (var i = 0; i < shopId.length; i++) {
        if (shopkN.indexOf(shopId[i]) == -1) {
          shopkN.push(shopId[i]);
        }
      }
      console.log(shopkN);
      //通过店铺ID来把商品归类
      let shopAttrs = shopkN.map(item => (lists.filter(sub => (sub.shopId == item))));
      console.log(shopAttrs);
      app.globalData.goods = shopAttrs;
      wx.navigateTo({
        url: '../orderSubmit/orderSubmit?types=1'
      });
    }
  },
  //点击跳转店铺详情
  bindTiaoMall(e) {
    console.log(e);
    let shops = e.currentTarget.dataset.shops;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shops}`
    })
  },
  //点击跳转商品详情
  bindShops(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    })
  },
})
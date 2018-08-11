// pages/add-address/add-address.js
Page({

  data: {
    array: ['请选择小区', '数码公寓', '豫博大厦', '世玺中心'],
    index:0,
  },

  onLoad: function (options) {
  
  },
  //选择小区
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})
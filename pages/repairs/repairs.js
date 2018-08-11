// pages/repairs/repairs.js
Page({

  data: {
    array: ['请选择类型', '天然气', '天然气1', '天然气2','天然气2'],
    index:0,
  },
  onLoad: function (options) {
  
  },
  //选择类型
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})
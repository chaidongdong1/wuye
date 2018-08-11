// pages/brand/brand.js
Page({

  data: {
    array: ['全部','华为', '特步', '小米', '美的'],
    index: 0,
  },

  onLoad: function(options) {
    
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

})
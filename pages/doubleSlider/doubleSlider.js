// 主要思想是：当点击第一个slider的时候，通过第二个slider的value值动态修改第一个slider的最大值（也就是第二个slider的value值），和第一个slider的最大宽度（从起点到第二个slider的距离）。同理，点击第二个slider的时候通过第一个slider的value值动态改变第二个slider的最小值，和第二个slider所能占的最大宽度。宽度值为0-100，wxml中通过在宽度值后面拼接'%'，从而改变slider的宽度样式。
// 初始化slider的时候，要初始化 max, rate, slider1Max和slider2Value的值
Page({
  data: {
    change: false, // 当两个slider在最右端重合时，将change设置为true，从而隐藏slider2，才能继续操作slider1
    max: 100, // 两个slider所能达到的最大值
    min: 0, // 两个slider所能取的最小值
    rate: 1, // slider的最大最小值之差和100（或1000）之间的比率
    scale: 1, // 比例系数。页面显示值的时候，需要将slider1Value(slider2Value)乘以比例系数scale
    slider1Max: 100, // slider1的最大取值
    slider2Value: 100, // slider2的值
    slider1Value: 0, // slider1的值
    slider2Min: 0, // slider2的最小取值
    slider1W: 100, // slider1的宽度
    slider2W: 0, // slider2的宽度
    inputMin: 0,
    inputMax: 100
  },
  changeStart: function (e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    if (idx === 1) {
      // dW是当前操作的slider所能占据的最大宽度百分数
      var dW = (this.data.slider2Value - this.data.min) / this.data.rate
      this.setData({
        slider1W: dW,
        slider2W: 100 - dW,
        slider1Max: this.data.slider2Value,
        slider2Min: this.data.slider2Value,
        change: false
      })
    } else if (idx === 2) {
      var dw = (this.data.max - this.data.slider1Value) / this.data.rate
      this.setData({
        slider2W: dw,
        slider1W: 100 - dw,
        slider1Max: this.data.slider1Value,
        slider2Min: this.data.slider1Value,
        change: false
      })
    }
  },
  changing: function (e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    var value = e.detail.value
    var result = value / this.data.rate
    if (idx === 1) {
      this.setData({
        slider1Value: value
      })
    } else if (idx === 2) {
      this.setData({
        slider2Value: value
      })
    }
  },
  changed: function (e) {
    if (this.data.slider1Value === this.data.slider2Value && this.data.slider2Value === this.data.max) {
      this.setData({
        change: true
      })
    }
  },
  inputMin: function (e) {
    var min = Number(e.detail.value)
    if (parseInt(min) !== min) {
      this.showTip('请输入整数')
      return
    }
    this.setData({
      inputMin: min
    })

  },
  inputMax: function (e) {
    var max = Number(e.detail.value)
    if (parseInt(max) !== max) {
      this.showTip('请输入整数')
      return
    }
    this.setData({
      inputMax: max // inputMax是用户自己输入的最大值。在slider中的最大取值是 inputMax 除以比例系数scale 后的结果。
    })
  },
  judgeNum: function (min, max) {
    var dValue = max - min
    var numOk = false
    if (dValue <= 0) {
      this.showTip('最大值应该大于最小值')
      return
    } else if (dValue <= 300) {
      this.setData({
        rate: dValue / 100,
        scale: 1
      })
      numOk = true // numOk是输入的数字合法的标识
    } else if (dValue <= 3000) {
      if (min % 10 != 0 || max % 10 != 0) {
        this.showTip('请输入整十数')
      } else {
        this.setData({
          rate: dValue / 1000,
          scale: 10
        })
        numOk = true
      }
    } else if (dValue > 3000) {
      this.showTip('差不能超过3000')
      numOk = false
    }
    return numOk
  },
  showTip: function (text) {
    wx.showToast({
      title: text,
    })
  },
  confirm: function () {
    var min = this.data.inputMin
    var max = this.data.inputMax
    var numOk = this.judgeNum(min, max)
    var scale = this.data.scale
    if (numOk) {
      this.setData({
        slider1Value: min / scale,
        slider1Min: min / scale,
        slider1Min: min / scale,
        slider1Max: max / scale,
        slider2Value: max / scale,
        slider2Max: max / scale,
        slider2Min: min / scale,
        slider2Max: max / scale,
        max: max / scale,
        min: min / scale,
        slider1W: 100,
        slider2W: 0
      })
    }
  }
})
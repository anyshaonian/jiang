// pages/scanner/scanner.js
var app = getApp()
Page({
  data: {},
  onLoad: function() {

  },
  click: function() {
    var that = this
    if (app.globalData.userInfo == null) {
      console.log("未登录");
      wx.showModal({
        title: '未登录',
        content: '请登陆后操作'
      })
      wx.switchTab({
        url: '/pages/merchant/merchant',
      })
    } else {
      wx.scanCode({
        success: (res) => {
          that.setData({
            id: res.result
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          that.checkTicket()

        },
        fail: (res) => {
          wx.showToast({
            title: '失败',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },

  checkTicket() {
    console.log(this.data.id)
    wx.request({
      url: 'http://localhost:8080/0621/insertUsedOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        id: this.data.id
      },
      success: res => {
        console.log('连接成功')

      }
    })
  }
})
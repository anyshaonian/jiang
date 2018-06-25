// pages/merchant/merchant.js
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function () {
    
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理,基本用不上
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  //点击了获取昵称后,
  getUserInfo: function (e) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          app.globalData.userInfo = e.detail.userInfo
          this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
          })
          //调用获取opendid
          this.getOpenidAndSessionkey()
          console.log('授权成功')
        } else {
          app.globalData.userInfo = null,
            this.setData({
              hasUserInfo: false
            })
          wx.showModal({
            title: '您取消了授权',
            content: '无法提供用户信息',
          })
        }
      }
    })
  },
//获取openid，session_key
  getOpenidAndSessionkey() {
    // 登录
    wx.login({
      success: res => {
        console.log('连接后台')
        //发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://193.112.94.186:8080/loginServlet',
            method: 'GET',
            header: {
              'Content-Type': 'json'
            },
            data: {
              code: res.code,
            },
            success: res => {
              var obj = {};
              obj.openid = res.data.openid;
              obj.session_key = res.data.session_key
              obj.expires_in = Date.now() + res.data.expires_in;
              console.log(obj);
              wx.setStorageSync('user', obj); //存储openid    
              //存储openid，session_key 解密
              this.setData({
                openid: res.data.openid,
                session_key: res.data.session_key
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

})
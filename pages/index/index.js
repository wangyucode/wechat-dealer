// index.js
// 获取应用实例
const app = getApp()

Page({
  onLoad:function(){
    this.setData({version: app.globalData.version});
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.login({
      success (res) {
        if (res.code) {
          wx.request({
            url: `${app.globalData.serverHost}/node/dealer/login?code=${res.code}`,
            enableHttp2: true,
            enableQuic: true,
            enableCache: true,
            success: (res) => {
              console.log('login->', res);
            },
            complete: () => {
              wx.hideLoading();
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  onShareAppMessage: function(){
    return {
      title: "聚会必备！万能发牌员，卧底，狼人，血染，抓阄，抽签，骰子...",
      path: "/pages/index/index",
      imageUrl: "/assets/share.png"
    }
  },
})

// index.js
// 获取应用实例
const app = getApp()

Page({
  onLoad: function ({ rid, type }) {
    this.setData({ version: app.globalData.version });
    app.login(() => {
      if (rid) {
        this.joinRoom(rid, type);
      }
    });
  },

  joinRoom: function(rid, type){
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.request({
      url: `${app.globalData.serverHost}/node/dealer/join?id=${rid}&type=${type}&pid=${app.globalData.pid}`,
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        wx.hideLoading();
        console.log('join->', res);
        if (res.data.success) {
          wx.navigateTo({
            url: `/pages/undercover/room?id=${res.data.payload}`,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "error"
          });
        }
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: "聚会必备！万能发牌员，卧底，狼人，血染，抓阄，抽签，骰子...",
      path: "/pages/index/index",
      imageUrl: "/assets/share.png"
    }
  },
})

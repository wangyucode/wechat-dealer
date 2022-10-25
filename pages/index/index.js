// index.js
// 获取应用实例
const app = getApp()

Page({
  onLoad: function () {
    this.setData({ version: app.globalData.version });
    app.login();
  },

  onShareAppMessage: function () {
    return {
      title: "聚会必备！万能发牌员，卧底，狼人，血染，抓阄，抽签，骰子...",
      path: "/pages/index/index",
      imageUrl: "/assets/share.png"
    }
  },
})

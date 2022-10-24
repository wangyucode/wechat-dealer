// index.js

import { getTypeKey, getTypeName } from "../util/utils";

// 获取应用实例
const app = getApp()

Page({
  onLoad: function () {
    this.setData({ version: app.globalData.version });
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.login({
      success:(res)=> {
        if (res.code) {
          wx.request({
            url: `${app.globalData.serverHost}/node/dealer/login?code=${res.code}`,
            enableHttp2: true,
            enableQuic: true,
            enableCache: true,
            success: (res) => {
              console.log('login->', res);
              if (res.data.success) {
                app.globalData.pid = res.data.payload.id;
                if (res.data.payload.roomId) {
                  this.showDialog(res.data.payload.type, res.data.payload.roomId);
                }
              }
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

  onShareAppMessage: function () {
    return {
      title: "聚会必备！万能发牌员，卧底，狼人，血染，抓阄，抽签，骰子...",
      path: "/pages/index/index",
      imageUrl: "/assets/share.png"
    }
  },

  showDialog: function (type, roomId) {
    wx.showModal({
      title: "回到房间？",
      content: `你当前在 ${getTypeName(type)} 的 ${roomId} 号房间！`,
      showCancel: true,
      cancelText: "退出房间",
      confirmText: "回到房间",
      success: (choose) => {
        if (choose.confirm) {
          wx.navigateTo({
            url: `/pages/${getTypeKey(type)}/room?id=${roomId}`,
          });
        } else {
          this.exitRoom(roomId);
        }
      }
    });
  },

  exitRoom: function (roomId) {
    wx.request({
      url: `${app.globalData.serverHost}/node/dealer/exit?rid=${roomId}&pid=${app.globalData.pid}`,
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        console.log('exit->', res);
      }
    });
  }
})

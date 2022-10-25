// app.js

import { getTypeKey, getTypeName } from "./util/utils";

App({
  globalData: {
    version: "1.0",
    preview: true,
    serverHost: 'http://localhost:8082',
    pid: null
  },

  login: function(callback){
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.login({
      success:(res)=> {
        if (res.code) {
          wx.request({
            url: `${this.globalData.serverHost}/node/dealer/login?code=${res.code}`,
            enableHttp2: true,
            enableQuic: true,
            enableCache: true,
            success: (res) => {
              console.log('login->', res);
              if (res.data.success) {
                this.globalData.pid = res.data.payload.id;
                if (res.data.payload.roomId) {
                  this.showDialog(res.data.payload.type, res.data.payload.roomId);
                } else {
                  callback && callback();
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
    });
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
      url: `${this.globalData.serverHost}/node/dealer/exit?rid=${roomId}&pid=${this.globalData.pid}`,
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        console.log('exit->', res);
      }
    });
  }
})

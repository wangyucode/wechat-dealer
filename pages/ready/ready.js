import { getTypeName, getTypeNote } from "../../util/utils";

// pages/undercover/ready.js
const app = getApp();
Page({

  data: {
    note: ""
  },

  type: 0,
  rid: 0,

  onLoad: function ({ type }) {
    this.type = Number.parseInt(type);
    wx.setNavigationBarTitle({
      title: getTypeName(this.type),
    });
    this.setData({ note: getTypeNote(this.type) });
  },

  onCreate: function () {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.request({
      url: `${app.globalData.serverHost}/node/dealer/create?type=${this.type}&pid=${app.globalData.pid}`,
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        console.log('create->', res);
        if (res.data.success) {
          wx.navigateTo({
            url: `/pages/undercover/room?id=${res.data.payload}`,
          });
        } else {
          app.login(this.onCreate);
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });

  },

  onInputRoomId: function ({ detail: { value } }) {
    this.rid = Number.parseInt(value);
  },

  onJoin: function () {
    if (this.rid > 0) {
      wx.showLoading({
        title: '请稍后...',
        mask: true
      });
      wx.request({
        url: `${app.globalData.serverHost}/node/dealer/join?id=${this.rid}&type=${this.type}&pid=${app.globalData.pid}`,
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
    } else {
      wx.showToast({
        title: '房间号错误',
        icon: "error"
      });
    }
  }
})
import { getTypeName, getTypeNote } from "../util/utils";

// pages/undercover/ready.js
const app = getApp();
Page({

  data: {
    note: ""
  },

  type: 0,

  onLoad: function ({ type }) {
    this.type = Number.parseInt(type);
    wx.setNavigationBarTitle({
      title: getTypeName(this.type),
    });
    this.setData({ note: getTypeNote(this.type) });
  },

  onCreate: function () {
    this.setData({ showCreate: false });
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
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    })

  }
})
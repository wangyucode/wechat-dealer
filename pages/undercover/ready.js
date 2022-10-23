// pages/undercover/ready.js
const app = getApp();
Page({

  data: {
    showCreate: false,
    showJoin: false,
    oneBlank: false,
    b: 0,
    u: 1,
    c: 3,
    all: 4,
    allBlank: false
  },

  onCreateMenu: function () {
    this.setData({ showCreate: true });
  },

  onJoinMenu: function () {
    this.setData({ showJoin: true });
  },

  onLeaveMenu: function () {
    this.setData({ showJoin: false, showCreate: false });
  },

  onOneBlank: function ({ detail: { value } }) {
    const b = value ? 1 : 0;
    const c = this.data.all - b - this.data.u;
    this.setData({
      oneBlank: value,
      b,
      c,
      allBlank: false
    })
  },

  onAllBlank: function ({ detail: { value } }) {
    const b = value ? this.data.all - this.data.u : 1;
    const c = this.data.all - b - this.data.u;
    this.setData({
      allBlank: value,
      b,
      c,
      oneBlank: true
    })
  },

  onAllChange: function ({ detail: { value } }) {
    const u = value < 7 ? 1 : value < 10 ? 2 : 3;
    const b = this.data.allBlank ? value - u : this.data.oneBlank ? 1 : 0;
    const c = value - u - b;
    this.setData({
      all: value,
      u,
      b,
      c
    })
  },

  onCreate: function(){
    this.setData({showCreate: false});
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.request({
      url: app.globalData.serverHost + '/node/dealer/create?type=0',
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        console.log('create->', res);
        wx.navigateTo({
          url: `/pages/undercover/room/room?id=${res.data}&pid=1`,
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    })
    
  }
})
// pages/my/support-operation/more-app/more-app.js
Page({

  data: {
    apps: []
  },

  onLoad: function () {
    this.getApps();
  },

  getApps: function () {
    wx.showLoading({
      title: '请稍后...',
    });
    wx.request({
      url: 'https://wycode.cn/node/apps',
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        console.log('apps->', res);
        if (res.data.success) {
          this.setData({
            apps: res.data.payload
          })
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})
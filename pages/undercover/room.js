// pages/undercover/room/room.js
const app = getApp();
const MESSAGE_INTERVAL_DELAY = 10000;
const AVATAR_URL = 'https://avatars.dicebear.com/api/avataaars/';
Page({

  data: {
    id: 0,
    showCreate: false,
    oneBlank: false,
    b: 0,
    u: 1,
    c: 3,
    all: 4,
    allBlank: false,
    message: '',
    leftPlayers: [
      { seat: '1', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '2', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '3', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '4', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '5', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '6', name: '空座位', avatar: '/assets/icons/plus.png' },
    ],
    rightPlayers: [
      { seat: '7', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '8', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '9', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '10', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '11', name: '空座位', avatar: '/assets/icons/plus.png' },
      { seat: '12', name: '空座位', avatar: '/assets/icons/plus.png' },
    ],
    lastJoinSeat: 1
  },

  index: 0,

  pollingIntervalId: 0,

  onLoad({ id }) {
    this.setData({ id });
    this.index = 0;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getMessages();
    this.setUpPolling();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearInterval(this.pollingIntervalId);
  },

  onShareAppMessage() {
    return {
      title: `快来加入 谁是卧底 ${this.data.id}号房间，${this.data.lastJoinSeat}等1`,
      path: `/pages/index/index?rid=${this.data.id}&type=0`,
    }
  },

  setUpPolling: function () {
    this.pollingIntervalId = setInterval(this.getMessages, MESSAGE_INTERVAL_DELAY);
  },

  getMessages: function () {
    wx.request({
      url: `${app.globalData.serverHost}/node/dealer/message?rid=${this.data.id}&index=${this.index}`,
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      success: (res) => {
        console.log('msg->', res);
        if (res.data.success) {
          res.data.payload.forEach(this.handleMessage);
        }
      }
    });
  },

  handleMessage: function ({ type, data }) {
    let message = this.data.message;
    switch (type) {
      case 1:
        message += `${data.roomId}号房间已创建`;
        break;
      case 2:
        message += `\n${data.seat}号玩家加入了房间`;
        this.data.lastJoinSeat = data.seat;
        if (data.playerId === app.globalData.pid) {
          this.setData({ pnum: data.seat });
        } else {
          message += `\n请等待房主开始游戏`;
        }
        if (data.seat < 7) {
          const player = this.data.leftPlayers[data.seat - 1];
          player.playerId = data.playerId;
          player.name = `${data.seat}号玩家`;
          player.avatar = `${AVATAR_URL}${data.playerId}.svg`
          this.setData({leftPlayers: this.data.leftPlayers});
        } else {
          const player = this.data.rightPlayers[data.seat - 1];
          player.playerId = data.playerId;
          player.name = `${data.seat}号玩家`;
          player.avatar = `${AVATAR_URL}${data.playerId}.svg`
          this.setData({rightPlayers: this.data.rightPlayers});
        }
        
        break;
    }
    this.index++;
    this.setData({ message });
  },

  onCreateMenu: function () {
    this.setData({ showCreate: true });
  },

  onLeaveMenu: function () {
    this.setData({ showCreate: false });
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
})
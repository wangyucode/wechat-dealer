// pages/undercover/room/room.js
Page({

  data: {
    id: 0,
    showCreate: false,
    oneBlank: false,
    b: 0,
    u: 1,
    c: 3,
    all: 4,
    allBlank: false
  },

  onLoad({id}) {
    this.setData({id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

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
// pages/rankmoon/rankmoon.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showpairarr: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var snap = [];
    var temp = [];
    if (app.globalData.getMyRecard && app.globalData.getMyRecard != 0) {
      // 根据配对数 添加数组
      for (var w = 0; w < app.globalData.getMyRecard.length; w++) {
        snap.push(app.globalData.getMyRecard[w])
      }

      for (var t = 0; t < snap.length - 1; t++) {
        for (var z = 0; z < snap.length - 1 - t; z++) {
          if (snap[z].score < snap[z + 1].score) {
            temp = snap[z]
            snap[z] = snap[z + 1]
            snap[z + 1] = temp
          }
        }
      }
      this.setData({
        showpairarr: snap,
      })
    }
  },
  navitosunny: function () {
    wx.redirectTo({
      url: '../ranksunny/ranksunny',
    })
  },

  navitostar: function () {
    wx.redirectTo({
      url: '../rankstar/rankstar',
    })
  },
  navitomain: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
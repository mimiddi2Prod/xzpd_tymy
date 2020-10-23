// pages/friendpage/friendpage.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    coordinate: [],

    showanalysis: '',
    showCheats: '',
    showpairarr: '',

    showpaid: false,

    unfoldinfo: '展开全部',
    foldinfo: '折叠起来',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var snap = [];
    var Coordinate = [];
    var frtemp = [];
    var frz = 0;

    var tops;
    var lefts;

    for (var y = app.globalData.getFriendRecard.length - 1; y >= 0; y--) {
      frtemp[frz] = app.globalData.getFriendRecard[y]
      frz++
    }

    for (var t = 0; t < frtemp.length; t++) {
      snap.push({
        isFold: true
      });
      this.setData({
        showanalysis: snap,
        showCheats: snap,
        showpairarr: frtemp,
      })
      // var random = Math.random()
      // if (random <= 0.25) {
      //   tops = parseInt(120 * Math.random() + 230)
      //   lefts = parseInt(110 * Math.random() + 190)
      // } else if (random <= 0.5) {
      //   tops = parseInt(120 * Math.random() + 470)
      //   lefts = parseInt(110 * Math.random() + 430)
      // } else if (random <= 0.75) {
      //   tops = parseInt(120 * Math.random() + 230)
      //   lefts = parseInt(110 * Math.random() + 430)
      // } else {
      //   tops = parseInt(120 * Math.random() + 470)
      //   lefts = parseInt(110 * Math.random() + 190)
      // }
      tops = parseInt(500 * Math.random() + 150)
      lefts = parseInt(410 * Math.random() + 150)
      while (tops > 360 && tops < 410) {
        tops = parseInt(500 * Math.random() + 150)
        // console.info(1)
      }
      while (lefts > 320 && lefts < 375) {
        lefts = parseInt(410 * Math.random() + 150)
      }
      //雷达
      Coordinate.push({
        url: frtemp[t].avatar2,
        isshow: frtemp[t].isshow,
        top: tops + 'rpx',
        left: lefts + 'rpx'
      })
      this.data.coordinate = this.data.coordinate.concat(Coordinate[t])
    }
    this.setData({
      coordinate: this.data.coordinate
    })
  },

  // 折叠展开
  showAll: function(e) {
    var i = e.currentTarget.id;
    this.data.showanalysis[i].isFold = !this.data.showanalysis[i].isFold;
    this.setData({
      showanalysis: this.data.showanalysis
    })
  },

  PaidshowAll: function(e) {
    // 测试用 支付与否
    var paid = false;
    // 测试用支付与否
    if (paid) {
      var j = e.currentTarget.id;
      this.data.showCheats[j].isFold = !this.data.showCheats[j].isFold;
      this.setData({
        showCheats: this.data.showCheats
      })
    } else {
      this.setData({
        showpaid: !this.data.showpaid,
      })
    }
  },

  Notpaid: function() {
    this.setData({
      showpaid: !this.data.showpaid,
    })
  },

  backindex: function() {
    app.globalData.loading = true
    wx.redirectTo({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
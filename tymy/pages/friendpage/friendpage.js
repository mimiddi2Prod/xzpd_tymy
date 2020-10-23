// pages/friendpage/friendpage.js
const app = getApp();

var friendopenid;
var snap = [];

var friendInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendAvatarUrl: null,

    friendMessage: '',

    messageNumber: '',
    seeThroughNumber: '',

    show: '',
    allmessage: true,

    showguide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.guide) {
      this.setData({
        showguide: true
      })
    }
  },

  // 引导
  Notshowguide: function () {
    this.setData({
      showguide: false,
    })
  },

  tomypage: function() {
    wx.switchTab({
      url: '../mypage/mypage',
    })
  },

  tosay: function() {
    wx.navigateTo({
      url: '../tosay/tosay',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 折叠展开
  show: function(e) {
    var i = e.currentTarget.id;
    this.data.show[i].isFold = !this.data.show[i].isFold;
    this.setData({
      show: this.data.show
    })
  },

  jiemimessage: function () {
    this.setData({
      allmessage: false
    })
  },

  allmessage: function () {
    this.setData({
      allmessage: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;

    friendopenid = app.globalData.friendOpenId;
    var myopenid = app.globalData.myOpenId;

    app.func.findUser(friendopenid, function(res) {
      friendInfo = res
      app.globalData.friendInfo = friendInfo;


      if (friendInfo) {
        that.setData({
          friendAvatarUrl: friendInfo.avatar,
          friendname: friendInfo.name
        })
      }
    })
    app.func.findFriendMessageSort(myopenid, friendopenid, function(res) {

      if (res && (res != 'fail')) {

        var messageNumber = res.length;
        var seeThroughNumber = 0;

        for (var t = 0; t < res.length; t++) {
          snap.push({
            isFold: true
          });

          if (res[t].isshow == 1) {
            seeThroughNumber++;
          }
        }

        that.setData({
          friendMessage: res,
          show: snap,
          messageNumber: messageNumber,
          seeThroughNumber: seeThroughNumber,
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      showguide: false,
    })
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
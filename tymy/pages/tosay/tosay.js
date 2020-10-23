// pages/tosay/tosay.js
const app = getApp();

var message;
var cue;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    message = '';
    cue = '';
  },

  tosay: function(e) {
    message = e.detail.value;
  },

  cue: function(e) {
    cue = e.detail.value;
  },

  isMessage: function() {
    var that = this;
    if (message == '') {
      wx.showToast({
        title: '留言不能为空',
        icon: 'none',
      })
    } else if (cue == '') {
      wx.showToast({
        title: '线索不能为空',
        icon: 'none',
      })
    } else {
      this.setData({
        loading: true
      })
      var myOpenid = app.globalData.myInfo.openid;

      var myAvatar;
      var myName;
      if (app.globalData.userInfo) {
        myAvatar = app.globalData.userInfo.avatarUrl;
        myName = app.globalData.userInfo.nickName;
      } else {
        myAvatar = app.globalData.myInfo.avatar;
        myName = app.globalData.myInfo.name;
      }


      // console.info(myAvatar);

      var friendOpenid = app.globalData.friendInfo.openid;
      var friendName = app.globalData.friendInfo.name;
      var friendAvatar = app.globalData.friendInfo.avatar;

      var friendMessage = message;
      var friendCue = cue;

      app.func.addMessage(myOpenid, myAvatar, myName, friendOpenid, friendName, friendAvatar, friendMessage, friendCue, function(res) {
        if (res == 'success') {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: '留言成功',
            icon: 'none',
          })
          // setTimeout(function() {
            wx.navigateBack({})
          // }, 2000)
        }
      })
    }
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
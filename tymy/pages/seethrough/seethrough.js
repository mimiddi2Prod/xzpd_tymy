// pages/seethrough/seethrough.js

const app = getApp();

var MessagePersonOpenId;
var seeThroughOpenId;
var Message;
var myopenid;
var Cue;

var havePair = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content1: '我的留言板',
    content2: '给他留言',
    imgs: '',
    bgcolor: '#FB8F74',

    seeThroughName: '',
    seeThroughAvatar: '',
    seeThroughCue: '',
    seeThroughMessage: '',

    show: false,
    not: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  tomypage: function() {
    wx.switchTab({
      url: '../mypage/mypage',
    })
  },

  tofriendpage: function() {
    app.globalData.friendOpenId = seeThroughOpenId
    wx.redirectTo({
      url: '../friendpage/friendpage',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;

    MessagePersonOpenId = app.globalData.MessagePersonOpenId;
    seeThroughOpenId = app.globalData.seeThroughOpenId;
    Message = app.globalData.Message;
    Cue = app.globalData.Cue;
    myopenid = app.globalData.myOpenId;

    // console.info(MessagePersonOpenId)
    // console.info(seeThroughOpenId)
    // console.info(Message)
    // console.info(myopenid)

    app.func.findMineMessage(myopenid, function(res) {

      for (var q = 0; q < res.length; q++) {
        if (res[q].openid1 == myopenid) {
          havePair = 1;
        }
      }

      if (MessagePersonOpenId == myopenid) {
        that.setData({
          imgs: '../images/baseicon/1.jpg',
          show: true,
          not: false,
        })
        app.func.isSeeThrough(MessagePersonOpenId, seeThroughOpenId, Message, function(res) {})

        app.func.findUser(MessagePersonOpenId, function(res) {
          that.setData({
            seeThroughName: res.name,
            seeThroughAvatar: res.avatar,
            seeThroughCue: Cue,
            seeThroughMessage: Message,

          })
        })

      } else if (seeThroughOpenId == myopenid) {
        wx.switchTab({
          url: '../mypage/mypage',
        })
      } else if (havePair == 1) {
        that.setData({
          imgs: '../images/baseicon/2.png',
          show: true
        })

        app.func.findUser(seeThroughOpenId, function(res) {
          that.setData({
            seeThroughName: '???',
            seeThroughAvatar: '../images/baseicon/lock-avatar.png',
            seeThroughCue: Cue,
            seeThroughMessage: Message,

          })
        })

      } else {
        that.setData({
          imgs: '../images/baseicon/3.jpg',
        })
      }
    })
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
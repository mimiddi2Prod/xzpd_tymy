// pages/mypage/mypage.js
const app = getApp()

var myopenid;

var snap = [];
var friendMessageInfo;

var j;

var id;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAvatarUrl: null,
    myname: null,

    friendMessage: '',
    show: '',
    messageNumber: '',
    seeThroughNumber: '',

    showpaid: false,

    showcue: false,

    showtext: false,

    showguide1: false,
    showguide2: false,
    showguide3: false,

    allmessage: true,
    indexs: '',

    load: false,

    // unfoldinfo: '展开全部',
    // foldinfo: '折叠起来',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (app.globalData.userInfo) {
      this.setData({
        myAvatarUrl: app.globalData.userInfo.avatarUrl,
        myname: app.globalData.userInfo.nickName
      })
    } else {
      this.setData({
        myAvatarUrl: app.globalData.myInfo.avatar,
        myname: app.globalData.myInfo.name
      })
    }

    wx.hideShareMenu({})

    if (app.globalData.guide) {
      this.setData({
        showguide1: true
      })
    }
  },

  toshare: function() {
    wx.navigateTo({
      url: '../share/share',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // sharetext: function() {

  // },

  jiemimessage: function() {
    this.setData({
      allmessage: false
    })
  },

  allmessage: function() {
    this.setData({
      allmessage: true
    })
  },

  // 折叠展开
  show: function(e) {
    var i = e.currentTarget.id;
    this.data.show[i].isFold = !this.data.show[i].isFold;
    this.setData({
      show: this.data.show
    })
  },

  // 引导
  Notshowguide1: function() {
    this.setData({
      showguide1: false,
      showguide2: true,
    })
  },

  Notshowguide2: function () {
    this.setData({
      showguide2: false,
      showguide3: true,
    })
  },

  Notshowguide3: function () {
    this.setData({
      showguide3: false,
    })
    app.globalData.guide = false
  },

  // 解谜
  tosharetext: function(e) {
    j = e.currentTarget.id;
    this.setData({
      showtext: !this.data.showtext,
      indexss: j
    })
  },

  Notshowtext: function() {
    this.setData({
      showtext: !this.data.showtext,
    })
  },

  // 线索展示
  toshowcue: function(e) {
    j = e.currentTarget.id;
    this.setData({
      showcue: !this.data.showcue,
      indexs: j
    })
  },

  Notshowcue: function() {
    this.setData({
      showcue: !this.data.showcue,
    })
  },

  // 支付
  topay: function(e) {
    j = e.currentTarget.id;
    //支付与否
    this.setData({
      showpaid: !this.data.showpaid,
      showcue: false,
      showtext: false,
    })
  },

  Notpaid: function() {
    this.setData({
      showpaid: !this.data.showpaid,
    })
  },

  payone: function() {
    myopenid = app.globalData.myOpenId;
    var money = 7.70;
    app.func.pay1(myopenid, money, function(res) {
      if (res == "requestPayment:ok") {
        app.func.isPaid(friendMessageInfo[j].openid1, friendMessageInfo[j].openid2, friendMessageInfo[j].message, function(res) {
          // console.info(res)
        })
      }
    })
  },

  getFriendMessage: function() {

    var that = this;
    myopenid = app.globalData.myOpenId;

    app.func.findFriendMessage(myopenid, function(res) {

      if (res && (res != 'fail')) {

        friendMessageInfo = res;

        var messageNumber = friendMessageInfo.length;
        var seeThroughNumber = 0;
        // console.info(friendMessageInfo)
        for (var t = 0; t < friendMessageInfo.length; t++) {
          snap.push({
            isFold: true
          });
          if (friendMessageInfo[t].isshow == 1 || friendMessageInfo[t].ispaid == 1) {
            seeThroughNumber++;
          }
        }

        that.setData({
          friendMessage: res,
          show: snap,
          messageNumber: messageNumber,
          seeThroughNumber: seeThroughNumber,
        })

      } else {
        that.setData({
          friendMessage: '',
        })
      }
    })
  },

  deletemessage: function(e) {
    id = e.currentTarget.id

    wx.showModal({
      title: '是否删除',
      content: '删除后不可恢复',
      success: function(res) {
        if (res.confirm) {
          app.func.deleteMessage(friendMessageInfo[id].openid1, friendMessageInfo[id].openid2, friendMessageInfo[id].message, function(res) {
            if (res == "success") {
              wx.showToast({
                title: '删除成功，请下拉刷新',
                icon: 'none',
              })

            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getFriendMessage();
    this.setData({
      load: false
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
    this.getFriendMessage();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function(e) {
    var that = this;
    var k = e.target.id;
    var MessageOpenid = friendMessageInfo[k].openid1;
    var Message = friendMessageInfo[k].message;
    var Cue = friendMessageInfo[k].cue;

    //  else {
    return {
      title: '承认吧，留言者就是你',
      // 分享path我的openid+好友openid
      path: 'pages/index/index?MessagePersonOpenId=' + MessageOpenid + '&seeThroughOpenId=' + myopenid + '&Message=' + Message + '&Cue=' + Cue,
      imageUrl: '../images/baseicon/seet.png',
      success: function() {
        // 如果分享成功，分享次数-1
        app.func.changeShareNumber(myopenid, MessageOpenid, Message, function(res) {

        })

        that.setData({
          showcue: false,
          showtext: false,
          load: true,
        })
      }
    }
    // }


  }
})
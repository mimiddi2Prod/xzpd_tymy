//index.js
//获取应用实例
const app = getApp()

var friendopenid;

var MessagePersonOpenId;
var seeThroughOpenId;
var Message;
var Cue;

var loading;
var myInfo = null;

var toadduser = false;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    myavatarUrl: '',
    loading: '',

    text1: '',
    text2: '',
    text3: '',
    text4: '',
  },

  onLoad: function(options) {
    friendopenid = '';
    seeThroughOpenId = '';
    MessagePersonOpenId = '';

    this.setText1()

    if (options.friendopenid) {
      friendopenid = options.friendopenid;
      app.globalData.friendOpenId = friendopenid;

      this.setText2()
    };
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      friendopenid = scene
      app.globalData.friendOpenId = friendopenid;

      this.setText2()
    };

    if (options.MessagePersonOpenId && options.seeThroughOpenId && options.Message && options.Cue) {
      MessagePersonOpenId = options.MessagePersonOpenId;
      app.globalData.MessagePersonOpenId = MessagePersonOpenId;

      seeThroughOpenId = options.seeThroughOpenId;
      app.globalData.seeThroughOpenId = seeThroughOpenId;

      Message = options.Message;
      app.globalData.Message = Message;

      Cue = options.Cue;
      app.globalData.Cue = Cue;

      this.setText2()
    }


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  setText1: function () {
    this.setData({
      text1: '1. 欢迎来到"填言觅语"',
      text2: '2. 在这里的每一条留言都来自于你的好友们',
      text3: '3. 但我们并不会显示TA的名字和头像哦',
      text4: '4. 根据他们的留言和线索，找出TA是谁吧',
    })
  },

  setText2: function() {
    this.setData({
      text1: '1. 欢迎来到"填言觅语"',
      text2: '2. 在这里你可以隐藏自己的身份给好友留言哦',
      text3: '3. 不要忘记留下线索，看看TA能猜到是你吗?',
      text4: '',
    })
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },

  // 开始测试
  start: function() {
    var that = this;
    if (toadduser) {
      if (!myInfo.id) {

        var myName = app.globalData.userInfo.nickName;
        var myAvatar = app.globalData.userInfo.avatarUrl;
        var myOpenid = app.globalData.myOpenId;

        app.func.addUser(myOpenid, myName, myAvatar, function(res) {

          if (res == "success") {
            app.globalData.guide = true;
            app.func.findUser(myOpenid, function(res) {
              that.setData({
                loading: true
              })
              myInfo = res

              app.globalData.myInfo = myInfo

              if (myInfo.id) {
                // 数据库有user数据
                that.setData({
                  myavatarUrl: myInfo.avatar
                })

                if (friendopenid && (friendopenid != myInfo.openid)) {
                  wx.redirectTo({
                    url: '../friendpage/friendpage',
                  })
                } else if (MessagePersonOpenId && seeThroughOpenId && Message) {
                  wx.redirectTo({
                    url: '../seethrough/seethrough',
                  })
                } else {
                  wx.switchTab({
                    url: '../mypage/mypage',
                  })
                }
              } else {
                toadduser = true
              }
            })
          }
        });
      }
    }
  },

  logins: function() {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.func.wxLogin(res.code, function(res) {

          app.globalData.myOpenId = res
          app.func.findUser(app.globalData.myOpenId, function(res) {

            myInfo = ''
            myInfo = res

            app.globalData.myInfo = myInfo

            if (myInfo.id) {
              that.setData({
                loading: true
              })
              // 数据库有user数据
              that.setData({
                myavatarUrl: myInfo.avatar
              })

              if (friendopenid && (friendopenid != myInfo.openid)) {
                wx.redirectTo({
                  url: '../friendpage/friendpage',
                })
              } else if (MessagePersonOpenId && seeThroughOpenId && Message) {
                wx.redirectTo({
                  url: '../seethrough/seethrough',
                })
              } else {
                wx.switchTab({
                  url: '../mypage/mypage',
                })
              }
            } else {
              toadduser = true
            }
          })
        })
      }
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
    this.logins();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // console.info(app.globalData.myOpenId)
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
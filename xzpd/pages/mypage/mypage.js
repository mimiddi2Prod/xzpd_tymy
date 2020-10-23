// pages/mypage/mypage.js
const app = getApp()

var myisshow = [];
var myispaid = [];

var timestamp;
var mytemp = [];
var snap = [];
var Coordinate = [];

var j;

var friendopenid;
var myopenid;

var length;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    coordinate: [],

    showanalysis: '',
    showCheats: '',
    showpairarr: '',

    showpaid: false,

    unfoldinfo: '展开全部',
    foldinfo: '折叠起来',

    myavatarUrl: '',

    nowpaid: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.load();
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


  //封装加载数据
  load: function() {
    var myz = 0;

    var tops;
    var lefts;

    if (app.globalData.getMyRecard && app.globalData.getMyRecard != 0) {
      for (var y = app.globalData.getMyRecard.length - 1; y >= 0; y--) {
        mytemp[myz] = app.globalData.getMyRecard[y]
        myz++
      }

      // 根据配对数 添加数组
      for (var t = 0; t < mytemp.length; t++) {
        snap.push({
          isFold: true
        });

        // var random = Math.random()
        // if (random <= 0.25) {
        //   tops = parseInt(120 * random + 230)
        //   lefts = parseInt(110 * random + 190)
        // } else if (random <= 0.5) {
        //   tops = parseInt(120 * random + 470)
        //   lefts = parseInt(110 * random + 430)
        // } else if (random <= 0.75) {
        //   tops = parseInt(120 * Math.random() + 930)
        //   lefts = parseInt(110 * Math.random() + 430)
        // } else {
        //   tops = parseInt(120 * Math.random() + 470)
        //   lefts = parseInt(110 * Math.random() + 190)
        // }
        // console.info(random)

        //雷达
        Coordinate.push({
          url: mytemp[t].avatar2,
          isshow: mytemp[t].isshow,
          top: tops + 'px',
          left: lefts + 'px',
        })

        var bIsFindInCoordinate = false;
        for (var j = 0; j < this.data.coordinate.length; j++) {
          if (this.data.coordinate[j].url == mytemp[t].avatar2) {
            bIsFindInCoordinate = true;
            break;
          }
        }
        if (bIsFindInCoordinate == false) {
          tops = parseInt(500 * Math.random() + 150)
          lefts = parseInt(410 * Math.random() + 150)
          while (tops > 360 && tops < 410) {
            tops = parseInt(500 * Math.random() + 150)
// console.info(1)
          }
          while (lefts > 320 && lefts < 375) {
            lefts = parseInt(410 * Math.random() + 150)
          }
          
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
          this.data.coordinate.push({
            url: mytemp[t].avatar2,
            isshow: mytemp[t].isshow,
            top: tops + 'rpx',
            left: lefts + 'rpx',
          })
        }

        this.setData({
          coordinate: this.data.coordinate
        })
        myisshow[t] = mytemp[t].isshow
        myispaid[t] = mytemp[t].ispaid
        app.globalData.nowpaid[t] = 0
        app.globalData.paid[t] = 0
      }
      length = app.globalData.nowpaid.length;
      this.setData({
        showanalysis: snap,
        showCheats: snap,
        showpairarr: mytemp,
      })
    }
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
    j = e.currentTarget.id;
    //展示与否 支付与否
    if (myispaid[j] == 1 || app.globalData.nowpaid[j] == 1) {
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

  // 解锁单条信息
  rqpayone: function() {

    var that = this;

    myopenid = app.globalData.myopenid;
    friendopenid = mytemp[j].openid2;
    wx.request({
      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/payfee',
      data: {
        openid: myopenid,
        money: 0.98,
      },
      header: {
        'Accept': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        // 调起支付
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function(res) {
            wx.request({
              url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/ispaid',
              data: {
                openid1: myopenid,
                openid2: friendopenid,
              },
              header: {
                'Accept': 'application/json'
              },
              method: 'GET',
              success: function(res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                });
                app.globalData.paid[length - 1 - j] = 1;
                app.globalData.nowpaid[j] = 1;

                that.setData({
                  showpaid: !that.data.showpaid,
                  nowpaid: app.globalData.nowpaid
                })
              }
            })
          },
          'fail': function(res) {},
          'complete': function(res) {}
        });
      },
      fail: function(res) {
        console.log(res.data)
      }
    });
  },

  // 解锁全部信息
  rqpayall: function() {
    var that = this;

    myopenid = app.globalData.myopenid;
    friendopenid = mytemp[j].openid2;
    wx.request({
      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/payfee',
      data: {
        openid: myopenid,
        money: 3.98,
      },
      header: {
        'Accept': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        // 调起支付
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function(res) {
            wx.request({
              url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/ispaid',
              data: {
                openid1: myopenid,
              },
              header: {
                'Accept': 'application/json'
              },
              method: 'GET',
              success: function(res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                });
                for (var u = 0; u < app.globalData.nowpaid.length; u++) {
                  app.globalData.nowpaid[u] = 1;
                }
                for (var q = 0; q < length; q++) {
                  app.globalData.paid[q] = 1;
                }
                that.setData({
                  showpaid: !that.data.showpaid,
                  nowpaid: app.globalData.nowpaid
                })
              }
            })
          },
          'fail': function(res) {},
          'complete': function(res) {}
        });
      },
      fail: function(res) {
        console.log(res.data)
      }
    });
  },

  Notpaid: function() {
    this.setData({
      showpaid: !this.data.showpaid,
    })
  },

  navito: function() {
    wx.navigateTo({
      url: '../ranksunny/ranksunny',
    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.myavatarUrl) {
      var myavatarUrls = app.globalData.myavatarUrl
      this.setData({
        myavatarUrl: myavatarUrls
      })
    }
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
    var that = this;
    app.globalData.getMyRecard = null;
    wx.request({
      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findrecard',
      data: {
        openid1: app.globalData.myopenid
      },
      header: {
        'Accept': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        app.globalData.getMyRecard = res.data;
        that.load();
        wx.stopPullDownRefresh();
      }
    })

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
    return {
      title: '看看你与' + app.globalData.userInfo.nickName + '有多配',
      // 分享我的openid
      path: 'pages/index/index?friendopenid=' + app.globalData.myopenid,
    }
  }
})
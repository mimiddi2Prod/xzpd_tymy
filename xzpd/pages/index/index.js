// pages/index/index.js
const app = getApp()

var util = require('../../utils/util.js')
var starapi = require('../../utils/starAPI.js')

var friendopenid;
var tosetdate;

var mydate;
var mystar;

var myopenid;

var getMyUserInfo;
var getFriendUserInfo;

var getMyRecard;
var getFriendRecard;

var name;
var img;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    endtime: '',

    choose: '',

    myavatarUrl: '',

    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    friendopenid = null;
    if (options.friendopenid) {
      friendopenid = options.friendopenid;
    }
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      friendopenid = scene
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

    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      endtime: time
    });

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
    var that = this;

    if (app.globalData.loading) {
      that.setData({
        loading: true
      })
    }

    // 获取code
    wx.login({
      success: function(res) {
        // 获取openid
        wx.request({
          url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/getopenid',
          data: {
            code: res.code
          },
          header: {
            'Accept': 'application/json'
          },
          method: 'GET',
          success: function(res) {
            myopenid = res.data.openid;
            if (!res.data.id) {
              // 如果user表没有openid -> 去设置日期
              tosetdate = true
            } else {
              // 如果user表有openid -> 获取数据
              // 个人info
              that.setData({
                loading: true
              })
              getMyUserInfo = res.data
              app.globalData.getMyUserInfo = getMyUserInfo

              tosetdate = false

              if (!app.globalData.userInfo) {

                app.globalData.myavatarUrl = getMyUserInfo.avatar
                that.setData({
                  myavatarUrl: getMyUserInfo.avatar
                })
              }
              // 朋友分享 添加数据
              if (friendopenid && (friendopenid != myopenid)) {

                wx.request({
                  url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findfrienduser',
                  data: {
                    openid: friendopenid,
                  },
                  header: {
                    'Accept': 'application/json'
                  },
                  method: 'GET',
                  success: function(res) {
                    // 好友info
                    getFriendUserInfo = res.data

                    wx.request({
                      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findrecard',
                      data: {
                        openid1: friendopenid,
                        openid2: myopenid,
                      },
                      header: {
                        'Accept': 'application/json'
                      },
                      method: 'GET',
                      success: function(res) {
                        if ((res.data.length != 0) && (res.data != 0)) {
                          wx.request({
                            url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findrecard',
                            data: {
                              openid1: friendopenid,
                              myopenid: myopenid
                            },
                            header: {
                              'Accept': 'application/json'
                            },
                            method: 'GET',
                            success: function(res) {
                              getFriendRecard = res.data;
                              app.globalData.getFriendRecard = getFriendRecard;
                              friendopenid = null;
                              wx.navigateTo({
                                url: '../friendpage/friendpage',
                              })
                            }
                          })
                        } else {
                          starapi.getallstar.pair(getMyUserInfo.date, getFriendUserInfo.date);

                          // 日期转化为星座
                          starapi.setconstellation.pair(function(info) {
                            mystar = info;
                            var Score = 0;

                            wx.request({
                              url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findpair',
                              data: {
                                constellation1: info[1]['number'],
                                constellation2: info[0]['number'],
                              },
                              header: {
                                'Accept': 'application/json'
                              },
                              method: 'GET',
                              success: function(res) {
                                var analysis2 = res.data[0].text;
                                var cheats2 = res.data[0].esoterica;
                                Score = res.data[0].score;

                                var isShow = 1;
                                if (Score >= 18) {
                                  var random = Math.random();
                                  if (random <= 0.4) {
                                    isShow = 0;
                                    Score = 10 * Math.random() + 90;
                                  } else {
                                    Score = 10 * Math.random() + 80;
                                  }
                                } else if (Score >= 16) {
                                  Score = 10 * Math.random() + 80;
                                } else if (Score >= 12) {
                                  Score = 20 * Math.random() + 60;
                                } else if (Score >= 10) {
                                  Score = 20 * Math.random() + 40;
                                } else if (Score >= 8) {
                                  Score = 20 * Math.random() + 20;
                                }
                                var friendispaid = 0;
                                if (getFriendUserInfo.ispaid == 1) {
                                  friendispaid = 1
                                }
                                wx.request({
                                  url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/addrecard',
                                  data: {
                                    openid1: friendopenid,
                                    name1: getFriendUserInfo.name,
                                    avatar1: getFriendUserInfo.avatar,
                                    constellation1: getFriendUserInfo.constellation,
                                    staricon1: getFriendUserInfo.staricon,

                                    openid2: myopenid,
                                    name2: getMyUserInfo.name,
                                    avatar2: getMyUserInfo.avatar,
                                    constellation2: mystar[0].constellation,
                                    staricon2: mystar[0].staricon,
                                    analysis: analysis2,
                                    cheats: cheats2,
                                    score: Score,
                                    isshow: isShow,
                                    ispaid: friendispaid,
                                  },
                                  header: {
                                    'Accept': 'application/json'
                                  },
                                  method: 'GET',
                                  success: function(res) {
                                    // 成功匹配后 取出所有好友数据
                                    wx.request({
                                      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findrecard',
                                      data: {
                                        openid1: friendopenid
                                      },
                                      header: {
                                        'Accept': 'application/json'
                                      },
                                      method: 'GET',
                                      success: function(res) {
                                        getFriendRecard = res.data
                                        app.globalData.getFriendRecard = getFriendRecard
                                        wx.navigateTo({
                                          url: '../friendpage/friendpage',
                                        })
                                      }
                                    })

                                    wx.request({
                                      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findpair',
                                      data: {
                                        constellation1: info[0]['number'],
                                        constellation2: info[1]['number'],
                                      },
                                      header: {
                                        'Accept': 'application/json'
                                      },
                                      method: 'GET',
                                      success: function(res) {
                                        var analysis1 = res.data[0].text;
                                        var cheats1 = res.data[0].esoterica;

                                        var ispaid = 0;

                                        if (getMyUserInfo.ispaid == 1) {
                                          ispaid = 1
                                        }

                                        wx.request({
                                          url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/addrecard',
                                          data: {
                                            openid1: myopenid,
                                            name1: getMyUserInfo.name,
                                            avatar1: getMyUserInfo.avatar,
                                            constellation1: mystar[0].constellation,
                                            staricon1: mystar[0].staricon,

                                            openid2: friendopenid,
                                            name2: getFriendUserInfo.name,
                                            avatar2: getFriendUserInfo.avatar,
                                            constellation2: getFriendUserInfo.constellation,
                                            staricon2: getFriendUserInfo.staricon,
                                            analysis: analysis1,
                                            cheats: cheats1,
                                            score: Score,
                                            isshow: isShow,
                                            ispaid: ispaid,
                                          },
                                          header: {
                                            'Accept': 'application/json'
                                          },
                                          method: 'GET',
                                          success: function(res) {}
                                        })
                                      },
                                    })
                                  }
                                })
                              },
                            })
                          })
                        }
                      }
                    })
                  }
                })
              } else {
                wx.request({
                  url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findrecard',
                  data: {
                    openid1: myopenid
                  },
                  header: {
                    'Accept': 'application/json'
                  },
                  method: 'GET',
                  success: function(res) {
                    getMyRecard = res.data;
                    app.globalData.getMyRecard = getMyRecard;
                    app.globalData.myopenid = myopenid;
                    myopenid = null;
                    friendopenid = null;
                    wx.navigateTo({
                      url: '../mypage/mypage',
                    })
                  }
                })
              }
            }
          },
        })
      }
    })
    // 获取code

  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 开始测试
  start: function() {
    if (tosetdate && app.globalData.userInfo) {
      this.setData({
        choose: true
      })
    }
  },

  // 选择日期
  changeDate: function(e) {
    var that = this
    mydate = e.detail.value.substring(5, 10);
    wx.showModal({
      title: '请确保填写正确生日信息',
      content: mydate,
      success: function(res) {
        if (res.confirm) {
          that.setData({
            loading: true
          })
          starapi.getmystar.pair(mydate);
          starapi.setconstellation.pair(function(info) {
            mystar = info;
          })
          wx.request({
            url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/adduser',
            data: {
              openid: myopenid,
              name: app.globalData.userInfo.nickName,
              avatar: app.globalData.userInfo.avatarUrl,
              constellation: mystar[0].constellation,
              staricon: mystar[0].staricon,
              date: mydate,
            },
            header: {
              'Accept': 'application/json'
            },
            method: 'GET',
            success: function(res) {
              // 朋友分享 添加数据
              if (friendopenid) {
                wx.request({
                  url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findfrienduser',
                  data: {
                    openid: friendopenid,
                  },
                  header: {
                    'Accept': 'application/json'
                  },
                  method: 'GET',
                  success: function(res) {
                    getFriendUserInfo = res.data
                    starapi.getallstar.pair(mydate, getFriendUserInfo.date);
                    // 日期转化为星座
                    starapi.setconstellation.pair(function(info) {
                      var Score = 0;

                      wx.request({
                        url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findpair',
                        data: {
                          constellation1: info[1]['number'],
                          constellation2: info[0]['number'],
                        },
                        header: {
                          'Accept': 'application/json'
                        },
                        method: 'GET',
                        success: function(res) {
                          var analysis2 = res.data[0].text;
                          var cheats2 = res.data[0].esoterica;
                          Score = res.data[0].score;

                          var isShow = 1;
                          if (Score >= 18) {
                            var random = Math.random();
                            if (random <= 0.4) {
                              isShow = 0;
                              Score = 10 * Math.random() + 90;
                            } else {
                              Score = 10 * Math.random() + 80;
                            }
                          } else if (Score >= 16) {
                            Score = 10 * Math.random() + 80;
                          } else if (Score >= 12) {
                            Score = 20 * Math.random() + 60;
                          } else if (Score >= 10) {
                            Score = 20 * Math.random() + 40;
                          } else if (Score >= 8) {
                            Score = 20 * Math.random() + 20;
                          }
                          var friendispaid = 0;
                          if (getFriendUserInfo.ispaid == 1) {
                            friendispaid = 1
                          }
                          wx.request({
                            url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/addrecard',
                            data: {
                              openid1: friendopenid,
                              name1: getFriendUserInfo.name,
                              avatar1: getFriendUserInfo.avatar,
                              constellation1: getFriendUserInfo.constellation,
                              staricon1: getFriendUserInfo.staricon,

                              openid2: myopenid,
                              name2: app.globalData.userInfo.nickName,
                              avatar2: app.globalData.userInfo.avatarUrl,
                              constellation2: mystar[0].constellation,
                              staricon2: mystar[0].staricon,
                              analysis: analysis2,
                              cheats: cheats2,
                              score: Score,
                              isshow: isShow,
                              ispaid: friendispaid,
                            },
                            header: {
                              'Accept': 'application/json'
                            },
                            method: 'GET',
                            success: function(res) {
                              // 成功匹配后 取出所有好友数据
                              wx.request({
                                url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findrecard',
                                data: {
                                  openid1: friendopenid
                                },
                                header: {
                                  'Accept': 'application/json'
                                },
                                method: 'GET',
                                success: function(res) {
                                  getFriendRecard = res.data;
                                  app.globalData.getFriendRecard = getFriendRecard;
                                  wx.navigateTo({
                                    url: '../friendpage/friendpage',
                                  })
                                }
                              })

                              wx.request({
                                url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/findpair',
                                data: {
                                  constellation1: info[0]['number'],
                                  constellation2: info[1]['number'],
                                },
                                header: {
                                  'Accept': 'application/json'
                                },
                                method: 'GET',
                                success: function(res) {
                                  var analysis1 = res.data[0].text;
                                  var cheats1 = res.data[0].esoterica;

                                  wx.request({
                                    url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/addrecard',
                                    data: {
                                      openid1: myopenid,
                                      name1: app.globalData.userInfo.nickName,
                                      avatar1: app.globalData.userInfo.avatarUrl,
                                      constellation1: mystar[0].constellation,
                                      staricon1: mystar[0].staricon,

                                      openid2: friendopenid,
                                      name2: getFriendUserInfo.name,
                                      avatar2: getFriendUserInfo.avatar,
                                      constellation2: getFriendUserInfo.constellation,
                                      staricon2: getFriendUserInfo.staricon,
                                      analysis: analysis1,
                                      cheats: cheats1,
                                      score: Score,
                                      isshow: isShow,
                                      ispaid: 0
                                    },
                                    header: {
                                      'Accept': 'application/json'
                                    },
                                    method: 'GET',
                                    success: function(res) {}
                                  })
                                },
                              })
                            }
                          })
                        },
                      })
                    })
                  }
                })
              } else {
                app.globalData.myopenid = myopenid;
                myopenid = null;
                friendopenid = null;
                wx.redirectTo({
                  url: '../mypage/mypage',
                })
              }
            },
          });
        }
      }
    });
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
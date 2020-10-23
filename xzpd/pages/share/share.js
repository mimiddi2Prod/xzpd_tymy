// pages/share/share.js

const app = getApp()

var name = "ta";
var myopenid;

var codeurl;

var height;
var width;

var codewidth;
var codehieght;

var codex;
var codey;

var avatarx;
var avatary;

var avatarR;

var avatarUrl;

var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    myavatarUrl: '',

    codeurl: '',

    avatarUrl: '',

    // height: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

      avatarUrl = app.globalData.userInfo.avatarUrl;

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        avatarUrl = res.userInfo.avatarUrl;
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
          avatarUrl = res.userInfo.avatarUrl;
        }
      })
    }


    if (app.globalData.myavatarUrl) {
      avatarUrl = app.globalData.myavatarUrl
    }
    that.setData({
      avatarUrl: avatarUrl
    })

    myopenid = app.globalData.myopenid;
    // 二维码测试
    wx.request({
      url: 'https://xzty.youyueworld.com/index.php/Home/xzpd/getwxaqrcode',
      data: {
        openid: myopenid,
        apptype: 'xz',
      },
      header: {
        'Accept': 'application/json'
      },
      method: 'GET',
      success: function(res) {

        codeurl = res.data
        // that.setData({
        //   codeurl: codeurl
        // })
        var phoneName = wx.getSystemInfoSync().model;
        // console.info(phoneName)

        // width = (wx.getSystemInfoSync().windowWidth / 750) * 750;
        width = (wx.getSystemInfoSync().windowWidth / 750) * 752;

        codewidth = (wx.getSystemInfoSync().windowWidth / 750) * 460;
        // codehieght = (wx.getSystemInfoSync().windowHeight / 1500) * 240
        // codewidth = 200;
        codehieght = codewidth;

        codex = (wx.getSystemInfoSync().windowWidth / 750) * 150;
        codey = (wx.getSystemInfoSync().windowHeight / 1500) * 740;

        avatarx = (wx.getSystemInfoSync().windowWidth / 750) * 380;

        if (phoneName == "iPhone X") {
          avatary = (wx.getSystemInfoSync().windowHeight / 1500) * 980;
          height = (wx.getSystemInfoSync().windowHeight / 1500) * 1400
        } else {
          avatary = (wx.getSystemInfoSync().windowHeight / 1500) * 1026;
          height = (wx.getSystemInfoSync().windowHeight / 1500) * 1370;
        }

        avatarR = (wx.getSystemInfoSync().windowWidth / 750) * 104;
        var avatarD = avatarR * 2;
        that.setData({
          height: height + 'px',
        })

        wx.downloadFile({
          url: codeurl,
          success: function(res) {
            // console.info(res.tempFilePath)

            var avatarPath = res.tempFilePath
            const ctx = wx.createCanvasContext('myCanvas')
            // console.info(avatarUrl)
            wx.downloadFile({
              url: avatarUrl,
              success: function(res) {
                var myavatar = res.tempFilePath;

                ctx.drawImage("../images/baseicon/share.jpg", 0, 0, width, height)
                ctx.drawImage(avatarPath, codex, codey, codewidth, codehieght)
                ctx.save();
                ctx.beginPath();
                ctx.arc(avatarx, avatary, avatarR, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(myavatar, avatarx - avatarR, avatary - avatarR, avatarD, avatarD);
                ctx.restore();

                ctx.draw()
              }
            })

          }
        });




        // const ctx = wx.createCanvasContext('myCanvas')

        // ctx.drawImage("../images/baseicon/share.jpg", 0, 0, width, height)
        // ctx.drawImage(codeurl, codex, codey, codewidth, codehieght)

        // ctx.save();
        // ctx.beginPath();
        // ctx.arc(avatarx, avatary, avatarR, 0, 2 * Math.PI);
        // ctx.closePath();
        // ctx.clip();
        // ctx.drawImage(avatarUrl, avatarx - avatarR, avatary - avatarR, avatarD, avatarD);
        // ctx.restore();

        // ctx.draw()
      }
    })
    // 二维码测试


  },

  save: function() {
    var destWidth = 2 * width;
    var destHeight = 2 * height;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      destWidth: destWidth,
      destHeight: destHeight,
      canvasId: 'myCanvas',
      success: function(res) {
        console.info(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function(res) {
            console.log(res.errMsg)
            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              // console.log("打开设置窗口");
              wx.showToast({
                title: '请允许保存到相册',
                icon: 'none',
              })
              wx.openSetting({
                success(settingdata) {
                  // console.log(settingdata)
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    // console.log("获取权限成功，再次点击图片保存到相册")
                  } else {
                    // console.log("获取权限失败")
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
    if (!app.globalData.userInfo) {
      name = app.globalData.getMyUserInfo.name
    } else {
      name = app.globalData.userInfo.nickName;
    }
    // if (app.globalData.myavatarUrl) {
    //   var myavatarUrls = app.globalData.myavatarUrl
    //   this.setData({
    //     myavatarUrl: myavatarUrls
    //   })
    // }
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
    return {
      title: '看看你与' + name + '有多配',
      // 分享我的openid
      path: 'pages/index/index?friendopenid=' + myopenid,
      success: function() {
        wx.navigateBack({})
      }
    }

  }
})
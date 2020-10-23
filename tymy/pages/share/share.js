// pages/share/share.js
const app = getApp();

var height;
var width;

var codewidth;
var codehieght;

var codex;
var codey;

var avatarx;
var avatary;

var avatarR;

var codeurl;
var myavatarurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // myAvatarUrl: null,

    height: '',
    img:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    if (app.globalData.userInfo) {
      // this.setData({
      //   myAvatarUrl: app.globalData.userInfo.avatarUrl
      // })
      myavatarurl = app.globalData.userInfo.avatarUrl
    } else {
      // this.setData({
      //   myAvatarUrl: app.globalData.myInfo.avatar
      // })
      myavatarurl = app.globalData.myInfo.avatar
    }

    wx.hideShareMenu({})

    var myopenid = app.globalData.myOpenId
    
    // 二维码测试
    wx.request({
      url: 'https://xzty.youyueworld.com/index.php/Home/tymy/getwxaqrcode',
      data: {
        openid: myopenid,
      },
      header: {
        'Accept': 'application/json'
      },
      method: 'GET',
      success: function(res) {
// console.info(res)
        codeurl = res.data

        // wx.getImageInfo({
        //   src: codeurl,
        //   success:function(res){
        //     console.info(res.path)
        //   }
        // })

        var phoneName = wx.getSystemInfoSync().model;

        // console.info(wx.getSystemInfoSync())

        width = (wx.getSystemInfoSync().windowWidth / 750) * 752;

        codewidth = (wx.getSystemInfoSync().windowWidth / 750) * 170;
        codehieght = codewidth;

        codex = (wx.getSystemInfoSync().windowWidth / 750) * 520;
        

        avatarx = (wx.getSystemInfoSync().windowWidth / 750) * 605;

        if (phoneName == "iPhone X") {
          avatary = (wx.getSystemInfoSync().windowHeight / 1500) * 628;
          height = (wx.getSystemInfoSync().windowHeight / 1500) * 1400;
          codey = (wx.getSystemInfoSync().windowHeight / 1500) * 540;
        } else {
          avatary = (wx.getSystemInfoSync().windowHeight / 1500) * 627;
          height = (wx.getSystemInfoSync().windowHeight / 1500) * 1370;
          codey = (wx.getSystemInfoSync().windowHeight / 1500) * 520;
        }

        avatarR = (wx.getSystemInfoSync().windowWidth / 750) * 36;
        var avatarD = avatarR * 2;

        that.setData({
          height: height + 'px'
        })


        wx.downloadFile({
          url: codeurl,
          success: function(res) {
            // console.info(res.tempFilePath)
            // console.info(2)

            var avatarPath = res.tempFilePath
            const ctx = wx.createCanvasContext('myCanvas')

            wx.downloadFile({
              url: myavatarurl,
              success: function(res) {
                var myavatar = res.tempFilePath;

                ctx.drawImage("../images/baseicon/3.jpg", 0, 0, width, height)
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

          },
          complete:function(res){
            // console.info(res)
          }
        });

      },
      complete:function(res){
        // console.info(res)
      }
    })
    // 二维码测试
  },

  save: function() {
    var destWidth = 3 * width;
    var destHeight = 3 * height;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      destWidth: destWidth,
      destHeight: destHeight,
      canvasId: 'myCanvas',
      success: function(res) {
        // console.info(res.tempFilePath)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(res){
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (res) {
            // console.log(res.errMsg)
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

    return {
      title: '留言让我猜猜你是谁吧',
      // 分享我的openid
      path: 'pages/index/index?friendopenid=' + app.globalData.myOpenId,
      success: function() {
        wx.navigateBack({})
      }
    }

  }
})
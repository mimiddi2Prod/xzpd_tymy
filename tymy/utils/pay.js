const app = getApp();

function pay1(myOpenid, money, callback) {
  
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/payfee',
    data: {
      openid: myOpenid,
      money: money,
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
          console.info(res.errMsg)
          return typeof callback == "function" && callback(res.errMsg)
        },
        'fail': function(res) {},
        'complete': function(res) {}
      });
    },
    fail: function(res) {
      console.log(res.data)
    }
  });
};

module.exports = {
  pay1: pay1,
};
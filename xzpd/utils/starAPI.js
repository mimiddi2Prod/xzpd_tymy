
var date = [];
var info = [];
var myconstellation;
var friendconstellation;


var starAPI = {
  getallstar: {
    pair: function (mydate, frienddate) {
      date[0] = mydate
      date[1] = frienddate
    }
  },

  getmystar: {
    pair: function (mydate) {
      date[0] = mydate
    }
  },

  // 根据日期匹配星座
  setconstellation: {
    pair: function (infomation) {
      if (date[1]) {
        info = [{
          'mydate': date[0]
        }, {
          'frienddate': date[1]
        }];
      } else {
        info = [{
          'mydate': date[0]
        }];
      }

      for (var i = 0; i < date.length; i++) {
        if (date[i] >= '03-21' && date[i] <= '04-19') {

          info[i]['constellation'] = '白羊'
          info[i]['staricon'] = '../images/staricon/baiyang.png'
          info[i]['number'] = 3

        } else if (date[i] >= '04-20' && date[i] <= '05-20') {

          info[i]['constellation'] = '金牛'
          info[i]['staricon'] = '../images/staricon/jinniu.png'
          info[i]['number'] = 4

        } else if (date[i] >= '05-21' && date[i] <= '06-21') {

          info[i]['constellation'] = '双子'
          info[i]['staricon'] = '../images/staricon/shuangzi.png'
          info[i]['number'] = 5

        } else if (date[i] >= '06-22' && date[i] <= '07-22') {

          info[i]['constellation'] = '巨蟹'
          info[i]['staricon'] = '../images/staricon/juxie.png'
          info[i]['number'] = 6

        } else if (date[i] >= '07-23' && date[i] <= '08-22') {

          info[i]['constellation'] = '狮子'
          info[i]['staricon'] = '../images/staricon/shizi.png'
          info[i]['number'] = 7

        } else if (date[i] >= '08-23' && date[i] <= '09-22') {

          info[i]['constellation'] = '处女'
          info[i]['staricon'] = '../images/staricon/chunv.png'
          info[i]['number'] = 8

        } else if (date[i] >= '09-23' && date[i] <= '10-23') {

          info[i]['constellation'] = '天秤'
          info[i]['staricon'] = '../images/staricon/tianping.png'
          info[i]['number'] = 9

        } else if (date[i] >= '10-24' && date[i] <= '11-22') {

          info[i]['constellation'] = '天蝎'
          info[i]['staricon'] = '../images/staricon/tianxie.png'
          info[i]['number'] = 10

        } else if (date[i] >= '11-23' && date[i] <= '12-21') {

          info[i]['constellation'] = '射手'
          info[i]['staricon'] = '../images/staricon/sheshou.png'
          info[i]['number'] = 11

        } else if ((date[i] >= '12-22' && date[i] <= '12-31') || (date[i] >= '01-01' && date[i] <= '01-19')) {

          info[i]['constellation'] = '摩羯'
          info[i]['staricon'] = '../images/staricon/mojie.png'
          info[i]['number'] = 12

        } else if (date[i] >= '01-20' && date[i] <= '02-18') {

          info[i]['constellation'] = '水瓶'
          info[i]['staricon'] = '../images/staricon/shuiping.png'
          info[i]['number'] = 1

        } else if (date[i] >= '02-19' && date[i] <= '03-20') {

          info[i]['constellation'] = '双鱼'
          info[i]['staricon'] = '../images/staricon/shuangyu.png'
          info[i]['number'] = 2

        }
      }
      infomation(info) || null;
    }
  },
}

module.exports = starAPI;
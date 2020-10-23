const app = getApp();

function wxLogin(code, callback) {
  // 获取openid
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/openid_get',
    data: {
      code: code
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data.openid)
    }
  })
};

function findUser(openid, callback) {
  // 获取用户表数据
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/user_find',
    data: {
      openid: openid,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function addUser(myOpenid, myName, myAvatar, callback) {
  // 用户表没数据 -> 添加数据  成功返回success 失败返回fail
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/user_add',
    data: {
      openid: myOpenid,
      name: myName,
      avatar: myAvatar,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function findMineMessage(myOpenId, callback) {
  // 我给谁留言 -> 我是否被识破
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_find_mine',
    data: {
      openid1: myOpenId,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function findFriendMessage(friendOpenId, callback) {
  // 谁给我留言 -> 我不知道是谁，去分享识破
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_find_mine',
    data: {
      openid2: friendOpenId,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function findFriendMessageSort(myOpenid, friendOpenId, callback) {
  // friendpage 排序展示
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_find_friend',
    data: {
      openid1: myOpenid,
      openid2: friendOpenId,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function addMessage(myOpenid, myAvatar, myName, friendOpenid, friendName, friendAvatar, friendMessage, friendCue, callback) {
  // openid 姓名 头像 留言 线索 识破 分享次数
  // 新增留言 -> 添加
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_add',
    data: {
      openid1: myOpenid,
      avatar1: myAvatar,
      name1: myName,
      openid2: friendOpenid,
      name2: friendName,
      avatar2: friendAvatar,
      message: friendMessage,
      cue: friendCue,
      isshow: 0,
      count: 3,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      console.info(1)
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function changeShareNumber(myOpenid, friendOpenid, Message, callback) {
  // 改变分享识破次数 -> 分享数为0，不能分享识破
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_count',
    data: {
      openid1: friendOpenid,
      openid2: myOpenid,
      message: Message,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function isSeeThrough(myOpenid, friendOpenid, Message, callback) {
  // 如果识破， 改识破字段
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_change_cue',
    data: {
      openid1: myOpenid,
      openid2: friendOpenid,
      message: Message,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function deleteMessage(friendOpenid, myOpenid, Message, callback) {
  // 删除信息
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/message_delete',
    data: {
      openid1: friendOpenid,
      openid2: myOpenid,
      message: Message,
    },
    header: {
      'Accept': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      return typeof callback == "function" && callback(res.data)
    }
  })
};

function isPaid(myOpenid, friendOpenid, message, callback) {
  wx.request({
    url: 'https://xzty.youyueworld.com/index.php/Home/tymy/ispaid',
    data: {
      openid1: myOpenid,
      openid2: friendOpenid,
      message: message
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
      return typeof callback == "function" && callback(res.data)
    }
  })
};

// function getQRcode(myOpenid, callback) {
//   wx.request({
//     url: 'https://www.geshijiancha.com/index.php/Home/qqh/getwxaqrcode',
//     data: {
//       openid: myOpenid,
//     },
//     header: {
//       'Accept': 'application/json'
//     },
//     method: 'GET',
//     success: function(res) {
//       return typeof callback == "function" && callback(res)
//     }
//   })
// };

module.exports = {
  wxLogin: wxLogin,
  findUser: findUser,
  addUser: addUser,
  findMineMessage: findMineMessage,
  findFriendMessage: findFriendMessage,
  addMessage: addMessage,
  changeShareNumber: changeShareNumber,
  isSeeThrough: isSeeThrough,
  deleteMessage: deleteMessage,
  isPaid: isPaid,
  findFriendMessageSort: findFriendMessageSort,
  // getQRcode: getQRcode,
};
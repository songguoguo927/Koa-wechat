'use strict'

const Koa = require('koa')
const app = new Koa()
const wechat = require('./wechat/wechat')
// const config = require('./config')
const config = {
  wechat: {
    appID: 'wx68a4e993aa4ac1d5', //公众号里面取
    AppSecret: 'caa0bf4d5db9836b88479b63b0fbfe93', //公众号里面取
    token: 'zidingyitoken' //自定义的token
  }
}  
app.use(wechat(config, async (message, ctx) => {
  // TODO

  // examples-学我说话
  if (message.MsgType === 'event' && message.Event === 'subscribe') {
    return '感谢您关注XJM的测试号'
  } else if (message.Content === '音乐') {
    return {
      type: 'music',
      content: {
        title: 'Lemon Tree',
        description: 'Lemon Tree',
        musicUrl: 'http://mp3.com/xx.mp3',
      },
    }
  } else if (message.MsgType === 'text') {
    return message.Content
  } else if (message.MsgType === 'image') {
    return {
      type: 'image',
      content: {
        mediaId: message.MediaId
      },
    }
  } else if (message.MsgType === 'voice') {
    return {
      type: 'voice',
      content: {
        mediaId: message.MediaId
      },
    }
  } else {
    return'JM的测试号'
  }
}))

app.listen(80)
console.log('listening:80')
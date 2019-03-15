'use strict'

const Koa = require('koa')
const app = new Koa()
const axios = require('axios')
const fs = require('fs-extra')
const wechat = require('./wechat/wechat')
// const config = require('./config')
const config = {
  wechat: {
    appid: 'wx68a4e993aa4ac1d5', //公众号里面取
    appsecret: 'caa0bf4d5db9836b88479b63b0fbfe93', //公众号里面取
    token: 'zidingyitoken' //自定义的token
  }
}  
//通过axios获取access_token
class API {
  constructor(appid, appsecret) {
    this.appid = appid
    this.appsecret = appsecret
    this.prefix = 'https://api.weixin.qq.com/cgi-bin/'  
  }
  async getAccessToken() {
  
    const response = await axios.get(`${this.prefix}token?grant_type=client_credential&appid=${this.appid}&secret=${this.appsecret}`)   
     console.log(response.data)
  } 
}
const api = new API(config.wechat.appid, config.wechat.appsecret)
// const api = new API(appid, appsecret)
api.getAccessToken()

app.use(wechat(config, async (message, ctx) => {
  // TODO

  // examples
  if (message.MsgType === 'event' && message.Event === 'subscribe') {
    return '感谢您关注JavaScript之禅'
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
    return'JavaScript之禅'
  }
}))

app.listen(80)
console.log('listening:80')
'use strict'

const Koa = require('koa')
// 引入node加密模块进行sha1加密
const crypto = require('crypto')
const getRawBody = require('raw-body')
const xml2js = require('xml2js')
const app = new Koa()
// 将配置文件独立到config.js
// const config = require('./config')
const config = {
  wechat: {
    appID: 'wx68a4e993aa4ac1d5', //公众号里面取
    AppSecret: 'caa0bf4d5db9836b88479b63b0fbfe93', //公众号里面取
    token: 'zidingyitoken' //自定义的token
  }
}           

app.use(async ctx => {
  const { signature, timestamp, nonce, echostr } = ctx.request.query 
    const TOKEN = config.wechat.token
  // GET 验证服务器
  if (ctx.method === 'GET') {
    if(signature  === getSignature(timestamp, nonce, TOKEN)){
    return ctx.body = echostr
    }
    ctx.status = 401   
    ctx.body = 'Invalid signature'
  }else if(ctx.method === 'POST') { // POST接收数据
     if (signature !== getSignature(timestamp, nonce, TOKEN)) {
      ctx.status = 401
      return ctx.body = 'Invalid signature'
    }
    // TODO
    // 取原始数据
    const xml = await getRawBody(ctx.req, {
      length: ctx.request.length,
      limit: '1mb',
      encoding: ctx.request.charset || 'utf-8'
    });
    // console.log(xml)
    const formatted = await parseXML(xml)
    console.log(formatted)
    // return ctx.body = 'success' // 直接回复success，微信服务器不会对此作任何处理
    ctx.type = 'application/xml'
return ctx.body = `<xml> 
<ToUserName><![CDATA[${formatted.FromUserName}]]></ToUserName> 
<FromUserName><![CDATA[${formatted.ToUserName}]]></FromUserName> 
<CreateTime>${new Date().getTime()}</CreateTime> 
<MsgType><![CDATA[text]]></MsgType> 
<Content><![CDATA[这儿是XJM的测试公众号]]></Content> 
</xml>`
 }
})

function getSignature (timestamp, nonce, token) {
  let hash = crypto.createHash('sha1')
  const arr = [token, timestamp, nonce].sort()
  hash.update(arr.join(''))
  return hash.digest('hex')
}

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true, explicitArray: false, ignoreAttrs: true }, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result.xml)
    })
  })
}
app.listen(80)

console.log('listening:80')
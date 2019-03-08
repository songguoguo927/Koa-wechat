'use strict'
//处理与微信交互的逻辑
var sha1 = require('sha1')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
    accessToken:prefix+'token?grant_type=client_credential&appid=APPID&secret=APPSECRET'
}

//读取、写入票据信息
function Wechat(opts) {
    var that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

   return this.getAccessToken()
    .then(function (data) {
        try{
            data = JSON.parse(data) //JSON化字符串
        }catch(e){//文件不存在或不合法更新票据
            return that.updateAccessToken(data)
        }
        //合法性检查
        if(that.isValidAccessToken(data)){
            //合法则向下传递
           return Promise.resolve(data)
        }else{
            //不合法过期进行更新
            return that.updateAccessToken()
        }
    })
    .then(function (data) {
        that.access_token = data.access_token
        that.expires_in = data.expires_in//过期字段

        that.saveAccessToken(data)  
        return Promise.resolve(data)  
 })
}
 Wechat.prototype.isValidAccessToken = function (data) {
     if(!data || !data.access_token || !data.expires_in){
         return false
     }else{
         var access_token = data.access_token
         var expires_in = data.expires_in
         var now = (new Date().getTime())

         if (now < expires_in){
             return true
         }else{
             return false
         }
     }
 }

 Wechat.prototype.updateAccessToken = function (data) {
     var appID = data.appID
     var appSecret =data.appSecret
     var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
     
     return new Promise(function (resolve, reject) {
         request({url: url,json:true}).then(function (response) {
            var data = response.body
            var now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 20)*1000//生成新的过期时间
         
            data.expires_in = expires_in

            resolve(data)
         })
       
     })
}
module.exports = function (opts) {
    var wechat = new Wechat(opts)
    return function *(next){
	    console.log(this.query)

	    var token = opts.token
	    var signature =this.query.signature
	    var nonce = this.query.nonce
	    var timestamp = this.query.timestamp
	    var echostr = this.query.echostr
 
	    var str = [token, timestamp, nonce].sort().join('')
	    var sha = sha1(str)
	    console.log(sha,signature);
	    if (sha === signature){
		    this.body = echostr + ''
	    }
	    else{
		    this.body = 'wrong'
	    }	
}
}

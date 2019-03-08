'use strict'

var Koa = require('koa')
var path = require('path')
var wechat = require('./wexin/g')
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var config = {
	wechat:{
		appID:'wxa7f50d6801e5692a',
		appSecret:'5242033ec71add653d9be7307edc04ed',
		token:'zidingyitoken',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken:function (data) {
			data = JSON.stringify(data)
			return util.writeFileAsync(wechat_file,data)
		}
	}
}
var app = new Koa()

app.use(wechat(config.wechat))

app.listen(80)

console.log('listening:80')

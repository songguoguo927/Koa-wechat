'use strict'

var Koa = require('koa')
var wechat = require('./wexin/g')

var config = {
	wechat:{
		appID:'wx68a4e993aa4ac1d5',
		appSecret:'caa0bf4d5db9836b88479b63b0fbfe93',
		token:'zidingyitoken'
	}
}
var app = new Koa()

app.use(wechat(config.wechat))

app.listen(80)

console.log('listening:80')

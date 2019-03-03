'use strict'

var Koa = require('koa')
var sha1 = require('sha1')
var config = {
	wechat:{
		appID:'wx68a4e993aa4ac1d5',
		appSecert:'caa0bf4d5db9836b88479b63b0fbfe93',
		token:'zidingyitoken'
	}
}
var app = new Koa()

app.use(function *(next){
	console.log(this.query)

	var token = config.wechat.token
	var signature =this.query.signature
	var nonce = this.query.nonce
	var timestamp = this.query.timestamp
	var echostr = this.query.echostr
 
	var str = [token, timestamp, nonce].sort().join('')
	var sha = sha1(str)

	if (sha === signature){
		this.body = echostr + ''
	}
	else{
		this.body = 'wrong'
	}

	
})

app.listen(1234)

console.log('listening:1234')
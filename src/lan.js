'use strict'


function lan (){
	this.name = 'lanyanan'
}

	/**
	 * @Author   lan
	 * @DateTime 2017-09-01
	 * 验证邮箱
	 */

lan.prototype.testEmail = function(string) {
	var szReg= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
	console.log(string)
	return szReg.test(string)

}

	/**
	 * @Author   lan
	 * @DateTime 2017-09-01
	 * 验证用户名 数字 字母 中文下划线 3到16字
	 */

lan.prototype.testUserName = function(string) {
	var szReg = /^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/;
	console.log(string)
	return szReg.test(string)
}

	/**
	 * @Author   lan
	 * @DateTime 2017-09-01
	 * @return   Boolean 密码强度正则，最少6位，包括至少1个大写字母，1个数字，
	 */

lan.prototype.testPassword = function(string) {
	var szReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
	console.log(string)
	return szReg.test(string)
}

module.exports = lan;
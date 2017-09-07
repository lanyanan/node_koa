const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const path = require('path');
const mime = require('mime');
const fss = require('fs');
const fs = require('mz/fs');
const mysql = require('mysql');
const lanyanan = new lan();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
//建立数据库连接
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'lan',
	password: '123',
	database: 'lan'
});
connection.connect();

async function querySql(slq) {
	return new Promise(function (resolve, reject) {
		connection.query(slq, function (error, results, fields) {
			if (error) throw reject(error);
			resolve(results);
		});
	});
}


function reponseData(string, code) {
	let data = {};
	data.code = code;
	data.msg = string;
	return JSON.stringify(data);
}


/**
 * @Author   lan
 * @DateTime 2017-08-30
 * 用户注册接口	
 */

router.post("/register", async (ctx, next) => {
	//缓存传递过来的参数
	let user = ctx.request.body.registerName,
	    email = ctx.request.body.registerEmail,
	    password = ctx.request.body.registerPassword;

	//判断校验用户名，密码，邮箱格式
	if (lanyanan.testUserName(user) && lanyanan.testEmail(email) && lanyanan.testPassword(password)) {
		await querySql('select * from t_user').then(async function (results) {
			let isQuery = true;
			results.map((item, index) => {
				if (item.userName === user) {
					isQuery = false;
					ctx.response.body = reponseData("用户名已经被使用",-1);
				} else if (item.email === email) {
					isQuery = false;
					ctx.response.body = reponseData("邮箱地址已经被使用",-1);
				}
			});
			if (isQuery) {
				await querySql(`insert into t_user (userName,email,password) values ('${user}','${email}','${password}')`).then(function (results) {
					ctx.response.body = reponseData("注册成功",0);
				});
			}
		});
	} else {
		if (!lanyanan.testUserName(user)) {
			ctx.response.body = reponseData("注册失败，用户名格式错误",-1);
		}
		if (!lanyanan.testEmail(email)) {
			ctx.response.body = reponseData("注册失败，邮箱格式错误",-1);
		}
		if (!lanyanan.testPassword(password)) {
			ctx.response.body = reponseData("注册失败，密码格式错误",-1);
		}
	}
});


/**
 * @Author   lan
 * @DateTime 2017-08-30
 * 用户登陆接口	
 */
router.post("/login", async (ctx, next) => {
	//缓存传递过来的参数
	let username = ctx.request.body.username,
	    password = ctx.request.body.password;

	//判断校验用户名，密码，邮箱格式
	if (lanyanan.testUserName(username) && lanyanan.testPassword(password)) {
		await querySql('select * from t_user').then(async function (results) {
			ctx.response.body = reponseData("用户名或密码错误", -1);
			results.map((item, index) => {
				if (item.userName === username && item.password === password) {
					ctx.response.body = reponseData("登陆成功", 0);
				}
			});
		});
	} else {
		if (!lanyanan.testUserName(username)) {
			ctx.response.body = reponseData("用户名格式错误",-1);
		}
		if (!lanyanan.testPassword(password)) {
			ctx.response.body = reponseData("密码格式错误",-1);
		}
	}
});

// url: 类似 '/view/static/'
// dir: 类似 __dirname + '/view/static'
function staticFiles(url, dir) {
	return async (ctx, next) => {
		let rpath = ctx.request.path;
		// 判断是否以指定的url开头:
		if (rpath.startsWith(url)) {
			// 获取文件完整路径:
			let fp = path.join(dir, rpath.substring(url.length));
			// 判断文件是否存在:
			if (await fs.exists(fp)) {
				// 查找文件的mime:
				ctx.response.type = mime.lookup(rpath);
				// 读取文件内容并赋值给response.body:
				ctx.response.body = await fs.readFile(fp);
			} else {
				// 文件不存在:
				ctx.response.status = 404;
			}
		} else {
			// 不是指定前缀的URL，继续处理下一个middleware:
			await next();
		}
	};
}

//处理前端静态资源
app.use(staticFiles('/view/', __dirname + '/view'));
//注入路由
app.use(router.routes());
//开启服务端口
app.listen(3000);

console.log("app 已经起来了");

// var mysql   = require('mysql');
// var connection = mysql.createConnection({
//  host   : 'localhost',
//  user   : 'me',
//  password : 'secret',
//  database : 'my_db'
// });

// connection.connect();

// // 增加记录
// client.query('insert into test (username ,password) values ("lupeng" , "123456")');

// // 删除记录
// client.query('delete from test where username = "lupeng"');

// // 修改记录
// client.query('update test set username = "pengloo53" where username = "lupeng"');

// // 查询记录
// client.query("select * from test" , function selectTable(err, rows, fields){
//  if (err){
//   throw err;
//  }
//  if (rows){
//   for(var i = 0 ; i < rows.length ; i++){
//    console.log("%d\t%s\t%s", rows[i].id,rows[i].username,rows[i].password);
//   }
//  }
// })
'use strict';

function lan() {
	this.name = 'lanyanan';
}

/**
 * @Author   lan
 * @DateTime 2017-09-01
 * 验证邮箱
 */

lan.prototype.testEmail = function (string) {
	var szReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	console.log(string);
	return szReg.test(string);
};

/**
 * @Author   lan
 * @DateTime 2017-09-01
 * 验证用户名 数字 字母 中文下划线 3到16字
 */

lan.prototype.testUserName = function (string) {
	var szReg = /^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/;
	console.log(string);
	return szReg.test(string);
};

/**
 * @Author   lan
 * @DateTime 2017-09-01
 * @return   Boolean 密码强度正则，最少6位，包括至少1个大写字母，1个数字，
 */

lan.prototype.testPassword = function (string) {
	var szReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
	console.log(string);
	return szReg.test(string);
};

module.exports = lan;
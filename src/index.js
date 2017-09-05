const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const path = require('path');
const mime = require('mime');
const fss = require('fs')
const fs = require('mz/fs');
const mysql = require('mysql');
const lanyanan = new lan();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser())
//建立数据库连接
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'lan',
  password : '123',
  database : 'lan'
}); 
connection.connect();


async function querySql(slq) {
	return new Promise(function(resolve, reject){
		connection.query(slq, function (error, results, fields) {
		    	if (error) throw reject(error);
				resolve(results)
		})
	})
}
/**
 * @Author   lan
 * @DateTime 2017-08-30
 * 用户注册接口	
 */
router.post("/register", async (ctx, next)=>{
	//缓存传递过来的参数
	let user = ctx.request.body.registerName,
	    email = ctx.request.body.registerEmail,
	    password = ctx.request.body.registerPassword;

	let data;
	//判断校验用户名，密码，邮箱格式
	if(lanyanan.testUserName(user) && lanyanan.testEmail(email) && lanyanan.testPassword(password)) {
		console.log(90)
		querySql('select * from login').then(function(results){
			let isQuery = true;
			console.log(results)
			results.map((item, index)=>{
				if(item.userName === user) {
					console.log(1)
					isQuery = false;
					ctx.response.body = "用户名已经被使用";
					console.log(34)
				}else if(item.email === email) {
					console.log(2)
					isQuery = false;
					ctx.response.body = "邮箱地址已经被使用";
				}	
			})
			if(isQuery) {
				console.log(3)
				await querySql(`insert into login (userName,email,password) values ('${user}','${email}','${password}')`).then(function(results){
					ctx.response.body = "注册成功"
				})	
			}
		})
	}else{
		console.log(80)
		if(!lanyanan.testUserName(user)) {
			ctx.response.body = "注册失败，用户名格式错误";
		}
		if(!lanyanan.testEmail(email)) {
			ctx.response.body = "注册失败，邮箱格式错误";
		}
		if(!lanyanan.testPassword(password)) {
			ctx.response.body = "注册失败，密码格式错误";
		}
		
	}
})





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
app.use(router.routes())
//开启服务端口
app.listen(3000);

console.log("app 已经起来了")




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
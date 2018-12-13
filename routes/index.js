var express = require('express');
var router = express.Router();

const filter = {password:0,__v:0}
const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册一个路由：用户注册
/*
     a) path 为: /register
    b) 请求方式为: POST
    c) 接收 username 和 password 参数
    d) admin 是已注册用户
    e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
    f) 注册失败返回: {code: 1, msg: '此用户已存在'}
* */
/*
    1、获取请求参数
    2、处理
    3、返回响应数据
* */
/*router.post('/register',function (req,res) {
    /!*const message = {
        code:0,
        data:{

        }
    }*!/
    //1、获取请求参数
    const {username,password} = req.body
    // 2、处理
    if(username === 'admin'){//注册失败
        res.send({code: 1, msg: '此用户已存在'})
    }else{//注册成功
        res.send({code:0,data:{id:'abc123',username,password}})
    }

})*/

//注册的路由
router.post('/register', function (req, res) {
    // 读取请求参数数据
    const {username, password, type} = req.body
    // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)
    UserModel.findOne({username}, function (err, user) {
        // 如果user有值(已存在)
        if(user) {
            // 返回提示错误的信息
            res.send({code: 1, msg: '此用户已存在'})
        } else { // 没值(不存在)
            // 保存
            new UserModel({username, type, password:md5(password)}).save(function (error, user) {

                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
                // 返回包含user的json数据
                const data = {username, type, _id: user._id} // 响应数据中不要携带password
                res.send({code: 0, data})
            })
        }
    })
    // 返回响应数据
})

//登录的路由

router.post('/login', (req, res) => {
    //获取请求参数
    const {username, password} = req.body
    // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
    UserModel.findOne({username, password:md5(password)}, filter, function (err, user) {
        if(user) { // 登陆成功
            // 生成一个cookie(userid: user._id), 并交给浏览器保存
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
            // 返回登陆成功信息(包含user)
            res.send({code: 0, data: user})
        } else {// 登陆失败
            res.send({code: 1, msg: '用户名或密码不正确!'})
        }
    })
    //返回数据

});

//更新用户信息的路由
router.post('/update', function (req, res) {
    // 从请求的cookie得到userid
    const userid = req.cookies.userid
    // 如果不存在, 直接返回一个提示信息
    if(!userid) {
        return res.send({code: 1, msg: '请先登陆'})
    }
    // 存在, 根据userid更新对应的user文档数据
    // 得到提交的用户数据
    const user = req.body // 没有_id
    UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {

        if(!oldUser) {
            // 通知浏览器删除userid cookie
            res.clearCookie('userid')
            // 返回返回一个提示信息
            res.send({code: 1, msg: '请先登陆'})
        } else {
            // 准备一个返回的user数据对象
            const {_id, username, type} = oldUser
            const data = Object.assign({_id, username, type}, user)
            // 返回
            res.send({code: 0, data})
        }
    })
})


//获取用户的信息的路由
router.get('/user',function (req,res) {
    // 从请求的cookie得到userid
    const userid = req.cookies.userid
    // 如果不存在, 直接返回一个提示信息
    if(!userid) {
        return res.send({code: 1, msg: '请先登陆'})
    }
    UserModel.findOne({_id:userid},filter,function (error,user) {
        res.send({code:0,data:user})
    })
})


//获取用户列表(根据类型)
router.get('/userlist',function (req,res) {
    const {type} = req.query
    console.log(req)

    UserModel.find({type},filter,function (error,users) {
        res.send({code:0,data:users})
    })
})

module.exports = router;

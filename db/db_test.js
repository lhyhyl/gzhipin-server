/*
* 测试使用mongoose操作mongodb数据库
* */

/*
    * 1. 连接数据库
        1.1. 引入 mongoose
        1.2. 连接指定数据库(URL 只有数据库是变化的)
        1.3. 获取连接对象
        1.4. 绑定连接完成的监听(用来提示连接成功)
    2. 得到对应特定集合的 Model
        2.1. 字义 Schema(描述文档结构)
        2.2. 定义 Model(与集合对应, 可以操作集合)
    3. 通过 Model 或其实例对集合数据进行 CRUD 操作
        3.1. 通过 Model 实例的 save()添加数据
        3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
        3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
        3.4. 通过 Model 的 remove()删除匹配的数据
* */
const md5 = require('blueimp-md5')//加密函数
/*1. 连接数据库*/
// 1.1. 引入 mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test2')
// 1.3. 获取连接对象
const conn = mongoose.connection
//1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',() => {
    console.log('数据库连接成功')
})

/*  2. 得到对应特定集合的 Model*/
// 2.1. 字义 Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},
    header:{type:String},
})
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user',userSchema)//集合名：users
/* 3. 通过 Model 或其实例对集合数据进行 CRUD 操作*/
// 3.1. 通过 Model 实例的 save()添加数据
~function () {
    //创建UserModel的实例
    const userModel = new UserModel({username: 'Marry', password: md5('345'), type: 'laoban'});
    //调用save()保存
    userModel.save((error,user) => {
        console.log('save()',error,user)
    })
}()
// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
~function () {
    //查询多个

    UserModel.find((error,users) => {
        console.log('find()',error,users)
    })
    //查询一个
    UserModel.findOne({_id:'5bdaaf13b8cd6e6b98adc6a2'},(error,user) => {
        console.log('findOne()',error,user)
    })
}()


// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
~function () {
   UserModel.findByIdAndUpdate({_id:'5bdaaf13b8cd6e6b98adc6a2'},{username:'jack'},(error,doc) => {
       console.log('findByIdAndUpdate()',error,doc)

   })
}()
// 3.4. 通过 Model 的 remove()删除匹配的数据
~function () {
    UserModel.remove({username:'marry'},(error,user) => {
        console.log('remove()',error,user)
    })
}()
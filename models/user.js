// 用户 collection
const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var userSchema = mongoose.Schema({
    phone: String,
    idNum: String,
    addr: String,
    status: Number, // 1 已注册 为实名认证  2实名认证 正常使用  3已注销
    userName: String, 
    pwd: String,
    balance: Number // 余额
 
},{
        timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var User = mongoose.model('user', userSchema);


module.exports = User;


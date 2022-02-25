// 用户 collection
const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var orderSchema = mongoose.Schema({
    price: Number,
    uid: { mongoose.Types.object }
 
},{
        timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var order = mongoose.model('order', orderSchema);


module.exports = order;


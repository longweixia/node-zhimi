var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
 "userId": String,
 "userName": String,
 "userPwd": String,
 "token":""
})

module.exports = mongoose.model('User',userSchema);//User是模型名字  users是关联的数据库，当数据库名带s时，可以省略
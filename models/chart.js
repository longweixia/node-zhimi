var mongoose = require('mongoose');
var chartSchema = new mongoose.Schema({
 "userId": String,
 "userImg": String,
 "userName": String,
 "socketid": String,
"oneChartList":[]
})

module.exports = mongoose.model('Chart',chartSchema);//User是模型名字  users是关联的数据库，当数据库名带s时，可以省略
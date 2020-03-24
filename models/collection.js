//收藏，喜欢
var mongoose = require('mongoose');
var collectionSchema = new mongoose.Schema({
    "userName": String,
     "resumeList":[]//收藏的模板简历id
    //  未来还要加的字段
})

module.exports = mongoose.model('Collection',collectionSchema);
var mongoose = require('mongoose');
var resumeSchema = new mongoose.Schema({
 "userName": String,
 "creatTime": String,
 "resumeContent":{//简历内容
    "base":[],//基本信息
    "major":[],//专业技能
    "work":[],//专业技能
    "project":[],//项目经验
    "education":[],//教育背景
    "evaluate":[]//自我评价
 }
})

module.exports = mongoose.model('Resume',resumeSchema);//User是模型名字  users是关联的数据库，当数据库名带s时，可以省略
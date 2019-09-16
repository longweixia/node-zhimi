// 简历图片相关
// 首页图片列表
var mongoose = require('mongoose');
var resumeImgSchema = new mongoose.Schema({
    "imgList":[]//自我评价
 
})

module.exports = mongoose.model('ResumeImg',resumeImgSchema);
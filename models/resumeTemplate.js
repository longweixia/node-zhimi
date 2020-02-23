// 模板简历编辑好的相关操作
var mongoose = require('mongoose');
var resumeTemplateSchema = new mongoose.Schema({
 "userName": String,//简历名称
//  "creatTime": String,
 "hasCommonResume":Boolean,//是否有基础简历的信息
//  "resumeContent":{//简历内容
//     "base":[],//基本信息
//     "major":[],//专业技能
//     "work":[],//专业技能
//     "project":[],//项目经验
//     "education":[],//教育背景
//     "evaluate":[]//自我评价
//  },
 "resumeTemplate":[//模板简历
   {
      "TemplateId":Number,//模板ID
      "resumeContent":{//简历内容
         "baseInfoList":{},//基本信息
         "SkillList":[],//技能特长
         "jobIntentionList":[],//求职意向
         "eduList":[],//教育背景
         "experienceList":[],//工作经验
         "selfEvaluation":String//自我评价  
      },
   }
 ]
})

module.exports = mongoose.model('ResumeTemplate',resumeTemplateSchema);//User是模型名字  users是关联的数据库，当数据库名带s时，可以省略
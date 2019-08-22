var express = require('express');
var router = express.Router();
var Resume = require('./../models/resume')
var  multer = require('multer');
let fs = require("fs");
// let path = require("path");


// 提交简历信息
router.post('/resumeInfo', function (req, res, next) {
    var param = {
        userName:req.body.userName,
        resumeContent:req.body.content,
        creatTime:(new Date).toString()
      }
      Resume.create(param, function (err, doc) {
        if (err) {
          res.json({
            status: "1",
            msg: "注提交失败" + err
          });
        } else {
          res.json({
            status: "0",
            msg: "提交成功",
            result:doc
          });
        }
      })
});

// 读取简历信息
router.post('/getResumeInfo', function (req, res, next) {
    var param = {
        userName:req.body.userName,
      }
      Resume.findOne(param, function (err, doc) {
        if (err) {
          res.json({
            status: "1",
            msg: "查询简历信息失败" + err
          });
        } else {
          res.json({
            status: "0",
            msg: "查询成功",
            result:doc
          });
        }
      })
});

//上传接口
router.post('/file', multer({
  //设置文件存储路径
 dest: 'upload'   //upload文件如果不存在则会自己创建一个。
}).single('file'), function (req, res, next) {
if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
  res.json({
    status: "1",
    msg: "上传失败" + err
  });
} else {
   let file = req.file;
   let fileInfo = {};
   console.log(file);
   fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname);//这里修改文件名字，比较随意。
   // 获取文件信息
   fileInfo.mimetype = file.mimetype;
   fileInfo.originalname = file.originalname;
   fileInfo.size = file.size;
   fileInfo.path = file.path;

   // 设置响应类型及编码
   res.set({
     'content-type': 'application/json; charset=utf-8'
  });

  res.json({
    status: "0",
    msg: "上传成功"
  });
}
});

//下载接口
router.post('/downImg', function (req, res, next) {

  fs.readFile("F:\\myproject\\zhimi\\node-zhimi\\upload\\img.png","binary",function(err,data){
if(err){
  console.log(err)
}else{
  res.write(data,"binary")
  res.end();

}
  })
 

});


module.exports = router;
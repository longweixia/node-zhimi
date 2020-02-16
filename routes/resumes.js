var express = require('express');
var router = express.Router();
var Resume = require('./../models/resume')
var  multer = require('multer');
let fs = require("fs");
// let path = require("path");

// 读取首页图片列表
router.post('/resumeImgList', function(req, res, next) {
  var paramas = req.body.flag;
  // const {resolve} = require('path')
  // console.log('__dirname : ' + __dirname)
  // console.log('resolve   : ' + resolve('./'))
  var resumePath = process.cwd() //当前命令所在的目录F:\myproject\zhimi\node-zhimi
  var url = []; //图片url列表数组
  console.log('cwd:' + resumePath)
  fs.readdir(resumePath + "/public/images", function(err, files) {
      if (err) {
          res.json({
              status: "1",
              msg: "查询文件失败" + err
          });
      } else {
        // 把文件路径中的\换成/在浏览器上显示
          files.forEach(function(file) {
            // 拼接url
              url.push("/images/" + file)
          });
          if (paramas == "all") {
              res.json({
                  status: "0",
                  msg: "查询图片列表成功",
                  result: files,
                  url: url
              });
          }

      }

  });
});

// 通过通用版提交
// 提交简历信息
router.post('/resumeInfo', function (req, res, next) {
    var param = {
        userName:req.body.userName,
        resumeContent:req.body.content,
        creatTime:(new Date).toString(),
        hasCommonResume:req.body.hasCommonResume
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
// 通过模板商城提交
// 提交简历信息
router.post('/resumeTemplate', function (req, res, next) {
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
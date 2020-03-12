var express = require('express');
var router = express.Router();
var Resume = require('./../models/resume')
var  multer = require('multer');
let fs = require("fs");
let path = require("path");
let mimeType = require("mime-types")

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
// router.post('/resumeTemplate', function (req, res, next) {
//   var param = {
//       userName:req.body.userName,
//       resumeContent:req.body.content,
//       creatTime:(new Date).toString()
//     }
//     Resume.create(param, function (err, doc) {
//       if (err) {
//         res.json({
//           status: "1",
//           msg: "注提交失败" + err
//         });
//       } else {
//         res.json({
//           status: "0",
//           msg: "提交成功",
//           result:doc
//         });
//       }
//     })
// });

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
  let name = req.body.name
  // dir 为要获取的文件夹
  let dir = "./public/images"
  // readdirSync返回一个包含指定目录下的所有文件,如：
  // ['homeList1.png','homeList2.png',...,'截图1.jpg] 
  let pa = fs.readdirSync(dir)
  // 找到图片匹配图片的方法
  function dirEach(){
    pa.forEach((item,index)=>{
       // 如果匹配到指定文件名
    if(item.split(".")[0] == name){
      // path.resolve将以/开始的路径片段作为根目录，
      // 在此之前的路径将会被丢弃，就像是在terminal中使用cd命令一样。获得在计算机上的绝对路径，如：
      // F:\myproject\zhimi\node-zhimi\public\images\截图1.jpg
      let itemPath = path.resolve(dir+"/"+item);
      // 使用 fs.statSync(fullPath).isDirectory() 来判断是否是文件目录，如果是，递归，找到下一级的图片
      let stat = fs.statSync(itemPath)
      if(stat.isDirectory()){
        dirEach(itemPath)
      }else{
        parse(itemPath)
      }
    }
    })
  }
  // 将图片转换为base64的方法
  function parse(filePath){
    let filenameList = filePath.split("\\").slice(-1)[0].split('.')
    let fileName = filenameList[0]
    // fs.readFileSync同步读取文件,<Buffer ff d8 ff e0 00 10...>
    let data = fs.readFileSync(filePath);
    // buffer对象转换成指定的字符编码的字符串
    data = new Buffer(data).toString("base64")
    let base64 = "data:"+mimeType.lookup(filePath)+";base64,"+data
    if(base64){
       res.json({
       status:"0",
       msg:base64,
       fileName:fileName
     })
    }
  
  }
  dirEach()
});
//删除接口
router.post('/deletaResume', function (req, res, next) {
  let name = req.body.name
  // dir 为要获取的文件夹
  let dir = "./public/images"
  // readdirSync返回一个包含指定目录下的所有文件,如：
  // ['homeList1.png','homeList2.png',...,'截图1.jpg] 
  let pa = fs.readdirSync(dir)
  // 找到图片匹配图片的方法
  function dirEach(){
    pa.forEach((item,index)=>{
       // 如果匹配到指定文件名
    if(item.split(".")[0] == name){
      // path.resolve将以/开始的路径片段作为根目录，
      // 在此之前的路径将会被丢弃，就像是在terminal中使用cd命令一样。获得在计算机上的绝对路径，如：
      // F:\myproject\zhimi\node-zhimi\public\images\截图1.jpg
      let itemPath = path.resolve(dir+"/"+item);
      // 使用 fs.statSync(fullPath).isDirectory() 来判断是否是文件目录，如果是，递归，找到下一级的图片
      let stat = fs.statSync(itemPath)
      if(stat.isDirectory()){
        dirEach(itemPath)
      }else{
       fs.unlinkSync(itemPath)
       res.json({
        status:"0",
        msg:""
      })
      }
      return false
    }
    })
  }
  dirEach()
  res.json({
    status:"0",
    msg:"删除失败"
  })
 
});


module.exports = router;
var express = require('express');
var router = express.Router();
var resumeTemplates = require('./../models/resumeTemplate')
var multer = require('multer');
let fs = require("fs");
let path = require("path");

// 通过模板商城提交
router.post('/resumeTemplates', function(req, res, next) {
    var param = {
        userName: req.body.content.userName,
        // TemplateId:req.param("TemplateId")
    }
    let TemplateId = req.body.TemplateId
    resumeTemplates.find(param, function(err0, doc0) {
        // 先查集合，看是否存在
        // 注意这里的判断：集合如果是空，那么doc0为空数组[]，我们不能这样判断doc0==[],
        // 因为数组是对象，为引用类型，任何两个数组都不相等，[]==[]为false，我们可以用
        // doc0==""做判断，它会进行隐式转换，即[].toString()==""，为true
        if (doc0 == "") {
            // 集合不存在，新建集合
            resumeTemplates.create(req.body.content, function(err, doc) {
                if (err) {
                    res.json({
                        status: "1",
                        msg: "提交失败" + err
                    });
                } else {
                    res.json({
                        status: "0",
                        msg: "提交成功"
                    });
                }
            })
        } else { //如果存在集合了，查询该模板是否存在，看TemplateId是否匹配
            let val = doc0[0].resumeTemplate
            for (var i = 0; i < val.length; i++) {
                // 如果存在，更新该模板简历
                if (val[i].TemplateId == TemplateId) {
                    doc0[0].resumeTemplate[i] = req.body.content.resumeTemplate[0]
                    doc0[0].save(function(err1, doc1) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: "提交失败" + err1
                            })
                        } else {
                            res.json({
                                status: "0",
                                msg: "已有该模板简历，提交成功"
                            })
                        }
                    })
                    // 如果有该模板简历了，就不执行下面代码了
                    // 注意:在map ,forEach循环中，return false只是退出该循环，而不会阻止后续代码执行
                    // 如果想阻止后面代码执行，使用for循环
                    return false
                }
              }
                // 如果没有改模板简历，就向简历数组中新建该简历
                doc0[0].resumeTemplate.push(req.body.content.resumeTemplate[0])
                doc0[0].save(function(err2, doc2) {
                    if (err2) {
                        res.json({
                            status: "1",
                            msg: "提交失败" + err2
                        })
                    } else {
                        res.json({
                            status: "0",
                            msg: "无该模板简历，提交成功"
                        })
                    }
                })
           

        }

    })
});

// 读取模板简历信息
router.get('/getTemplatesResume', function(req, res, next) {
    var param = {
        userName: req.param("userName"),
        // TemplateId:req.param("TemplateId")
    }
    let TemplateId = req.param("TemplateId")
    // console.log(param,TemplateId)
    resumeTemplates.findOne(param, function(err, doc) {
      for(var i=0;i<doc.resumeTemplate.length;i++){
        if (doc.resumeTemplate[i].TemplateId == TemplateId) {
          res.json({
              status: "0",
              msg: "查询成功",
              result: doc.resumeTemplate[i]
          });
          return false
      } 
    }
          res.json({
              status: "0",
              msg: "查询成功，无数据",
              result: ""
          });
    })
});

// 读取保存的简历图片
router.get('/getMyResume', function(req, res, next) {
    var param = {
        userName: req.param("userName"),
    }
    resumeTemplates.findOne(param, function(err, doc) {
         //如果没有保存简历，返回空
          if(doc==[]||doc==null||doc==""){
              res.json({
              status: "1",
              msg: "抱歉，您没有提交的简历",
              result: ""
          });
          return false
          }
        //如果有，找到每个简历的图片字段，组成一个数组   
          let imgList=[];
          let content = doc.resumeTemplate
          for(var i=0;i<content.length;i++){
              imgList.push(content[i].img)
        }
        res.json({
            status: "0",
            msg: "查询成功",
            result: imgList
        });
    })
});

// 删除保存的简历
router.post('/deletaResume', function(req, res, next) {
    var param = {
        userName: req.param("userName"),
    }
    let name = req.body.name
    resumeTemplates.findOne(param, function(err, doc) {
        doc.update({$pull:{resumeTemplate:{TemplateId:name}}},function(err1,doc1){
            if(err1){
                res.json({
                    status: "01",
                    msg: "删除失败"+err1
                });
            }else{
                res.json({
                    status: "0",
                    msg: "删除成功"
                });
            }
        })
    })
});

// 查询该模板是否保存了简历
router.get('/findHasResume', function(req, res, next) {
    var param = {
        userName: req.param("userName"),
    }
    resumeTemplates.findOne(param, function(err, doc) {
         //如果没有保存简历，返回空
          if(doc==[]||doc==null||doc==""){
              res.json({
              status: "1",
              msg: "抱歉，您没有提交的简历",
              result: "1"
          });
          return false
          }
        
          let imgList=[];
          let content = doc.resumeTemplate
          for(var i=0;i<content.length;i++){
            //如果有，返回
              if(content[i].TemplateId==req.param("TemplateId")){
                res.json({
                    status: "0",
                    msg: "查询到您在该模板下有一份简历",
                    result: "0"
                });
                return false
              }
        }
        res.json({
            status: "1",
            msg: "抱歉，您没有提交的简历",
            result: "1"
        });
    })
});

// // 读取首页图片列表
// router.post('/resumeImgList', function(req, res, next) {
//   var paramas = req.body.flag;
//   // const {resolve} = require('path')
//   // console.log('__dirname : ' + __dirname)
//   // console.log('resolve   : ' + resolve('./'))
//   var resumePath = process.cwd() //当前命令所在的目录F:\myproject\zhimi\node-zhimi
//   var url = []; //图片url列表数组
//   console.log('cwd:' + resumePath)
//   fs.readdir(resumePath + "/public/images", function(err, files) {
//       if (err) {
//           res.json({
//               status: "1",
//               msg: "查询文件失败" + err
//           });
//       } else {
//         // 把文件路径中的\换成/在浏览器上显示
//           files.forEach(function(file) {
//             // 拼接url
//               url.push("/images/" + file)
//           });
//           if (paramas == "all") {
//               res.json({
//                   status: "0",
//                   msg: "查询图片列表成功",
//                   result: files,
//                   url: url
//               });
//           }

//       }

//   });
// });

// // 通过通用版提交
// // 提交简历信息
// router.post('/resumeInfo', function (req, res, next) {
//     var param = {
//         userName:req.body.userName,
//         resumeContent:req.body.content,
//         creatTime:(new Date).toString(),
//         hasCommonResume:req.body.hasCommonResume
//       }
//       Resume.create(param, function (err, doc) {
//         if (err) {
//           res.json({
//             status: "1",
//             msg: "注提交失败" + err
//           });
//         } else {
//           res.json({
//             status: "0",
//             msg: "提交成功",
//             result:doc
//           });
//         }
//       })
// });




// //上传接口
// router.post('/file', multer({
//   //设置文件存储路径
//  dest: 'upload'   //upload文件如果不存在则会自己创建一个。
// }).single('file'), function (req, res, next) {
// if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
//   res.json({
//     status: "1",
//     msg: "上传失败" + err
//   });
// } else {
//    let file = req.file;
//    let fileInfo = {};
//    console.log(file);
//    fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname);//这里修改文件名字，比较随意。
//    // 获取文件信息
//    fileInfo.mimetype = file.mimetype;
//    fileInfo.originalname = file.originalname;
//    fileInfo.size = file.size;
//    fileInfo.path = file.path;

//    // 设置响应类型及编码
//    res.set({
//      'content-type': 'application/json; charset=utf-8'
//   });

//   res.json({
//     status: "0",
//     msg: "上传成功"
//   });
// }
// });

// //下载接口
// router.post('/downImg', function (req, res, next) {

//   fs.readFile("F:\\myproject\\zhimi\\node-zhimi\\upload\\img.png","binary",function(err,data){
// if(err){
//   console.log(err)
// }else{
//   res.write(data,"binary")
//   res.end();

// }
//   })


// });


module.exports = router;
var express = require('express');
var router = express.Router();
var malls = require('./../models/mall')
var multer = require('multer');
let fs = require("fs");
let path = require("path");
var Collections = require('./../models/collection')
// //方式1
// // 上传模板商城图片，存base64在数据库
// router.post('/uploadImg', function(req, res, next) {
//     malls.find(function(err, docs) {
//         let params = {
//             imgUrl: req.body.imgUrl,
//             mallId: docs.length,
//             indexs: docs.length
//         }
//         malls.create(params, function(err1, doc1) {
//             if (err1) {
//                 res.json({
//                     status: "1",
//                     msg: "上传失败" + err1
//                 });
//             } else {
//                 res.json({
//                     status: "0",
//                     msg: "上传成功",
//                 });
//             }
//         })
//     })
// });
////方式1结束
// 上传模板商城图片，方式2开始，存图片路径在数据库
router.post('/uploadImg',multer({
    //设置文件存储路径
   dest: 'upload'   //upload文件如果不存在则会自己创建一个。
  }).single('file'), function (req, res, next) {
  if (req.file.length === 0) {  //判断一下上传的文件是否存在，也可以在前端代码中进行判断。
    res.json({
      status: "1",
      msg: "上传失败" + err
    });
  } else {
     let file = req.file;
     let mallId = req.body.mallId
     console.log(mallId,file.originalname,"-====")
    //  let fileInfo = {};
     
     fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname);//这里修改文件名字，比较随意。
     // 获取文件信息
    //  fileInfo.mimetype = file.mimetype;
    //  fileInfo.originalname = file.originalname;
    //  fileInfo.size = file.size;
    //  fileInfo.path = file.path;
    //  console.log(fileInfo,"fileInfo");
        malls.find(function(err, docs) {
        let params = {
            imgUrl: "F:/myproject/zhimi/node-zhimi/upload/"+file.originalname,
            mallId:mallId,
            indexs: mallId
        }
        malls.create(params, function(err1, doc1) {
             // 设置响应类型及编码
     res.set({
        'content-type': 'application/json; charset=utf-8'
     });
            if (err1) {
                res.json({
                    status: "1",
                    msg: "上传失败" + err1
                });
            } else {
                res.json({
                    status: "0",
                    msg: "上传成功",
                });
            }
        })
    })
  
    
  
    // res.json({
    //   status: "0",
    //   msg: "上传成功"
    // });
  }
  }
  );
// 方式2结束
// 读取模板商城图片
router.get('/getImgList', function(req, res, next) {
    let pageSize = req.param("pageSize")
    let currentPage = req.param("currentPage")
    let Collect = {userName:req.param("userName")}
    let skip = (currentPage-1)*pageSize//从哪一条开始查询
    let totol;//总条数
    malls.find().exec({},function(err0,doc0){
        totol = doc0.length;
        // 这个需要pageSize转换为数字，因为传过来成了字符串
        let allMall = malls.find().skip(skip).limit(Number(pageSize))
        allMall.exec({},function(err1,doc1){
            if(err1){
                res.json({
                    status: "1",
                    msg: "查询失败"+err1,
                    result: ""
                });
                return false
            }
            // 需要查询下当前用户有没有收藏该模板，如果有的话要返回给用户
            Collections.findOne(Collect, function(err2, doc2) {
                // 如果查询收藏失败，直接返回模板商城数据
                if(err2){
                    res.json({
                        status: "0",
                        msg: "查询模板成功，查询是否收藏失败",
                        result: doc1
                    });
                    return false
                }
                //注意： 这里发现直接给doc1加上collectText属性，加不上。所以，深克隆一份，给新对象挂载属性
                var doc1b = JSON.parse(JSON.stringify(doc1))
                doc1b.forEach(item => {
                    item.collectText="收藏"
                });
                // 如果用户没有收藏，则给每个模板加上collectText:"收藏"
                if(doc2==[]||doc2==null||doc2==""){
                    res.json({
                    status: "1",
                    msg: "抱歉，您没有收藏的简历",
                    result: {list:doc1b,totol:totol}
                });
            }else{
                
                for(var t=0;t<doc2.resumeList.length;t++){
                    for(var i=0;i<doc1b.length;i++){
                            if(doc2.resumeList[t].mallId==doc1b[i].mallId){
                            console.log("已经收藏",doc1b[i].mallId)
                            //注意： doc1[i].collectText="已经收藏" ，这样添加属性是不生效的，只能给克隆对象添加
                            doc1b[i].collectText="已收藏"
                           
                        }
                    }
                }
                    res.json({
                        status: "0",
                        msg: "获取成功",
                        result:{
                            list:doc1b,
                            totol:totol
                        }
                    });
            }
            })       
        })
    })
 
});


module.exports = router;
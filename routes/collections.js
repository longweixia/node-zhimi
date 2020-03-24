var express = require('express');
var router = express.Router();
var Collections = require('./../models/collection')
var malls = require('./../models/mall')
let fs = require("fs");

// 收藏简历模板
router.post('/resume', function(req, res, next) {
    var param = {
        userName: req.body.userName
    }
    let mallId = req.body.mallId
    Collections.findOne(param, function(err, doc) {
        // 如果集合不存在，创建集合
        if(doc==null){
            let resumeList = [].push(mallId)
            Collections.create({"userName": req.body.userName,"resumeList":resumeList}, function(err1, doc1) {
                if (err1) {
                    res.json({
                        status: "1",
                        msg: "提交失败" + err1
                    });
                } else {
                    res.json({
                        status: "0",
                        msg: "提交成功"
                    });
                }
            })
        }
    })
});

// 读取收藏的简历图片
router.get('/getResume', function(req, res, next) {
    var param = {
        userName: req.param("userName"),
    }
    Collections.findOne(param, function(err, doc) {
         //如果没有保存简历，返回空
          if(doc==[]||doc==null||doc==""){
              res.json({
              status: "1",
              msg: "抱歉，您没有收藏的简历",
              result: ""
          });
          return false
          }
        //如果有，找到每个简历的图片id，然后通过id去malls集合去找   
          let imgList=[];
          let content = doc.resumeList
          malls.find(function(err1, doc1) {
              console.log(doc1.mallId,doc1[0],"doc1")
          })
          for(var i=0;i<content.length;i++){
            //   imgList.push(content[i].img)
            // malls.findOne(param, function(err, doc) {})
        }
        res.json({
            status: "0",
            msg: "查询成功",
            result: imgList
        });
    })
});

module.exports = router;
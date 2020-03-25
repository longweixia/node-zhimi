var express = require('express');
var router = express.Router();
var Collections = require('./../models/collection')
var malls = require('./../models/mall')
let fs = require("fs");

// 收藏/取消简历模板
router.post('/resume', function(req, res, next) {
    var param = {
        userName: req.body.userName
    }
    let mallId = req.body.mallId
    
    Collections.findOne(param, function(err, doc) {
        // 定义添加收藏方法
    function collect(){
        // 当resumeList为空数组，或者mallId不存在resumeList数组中，就添加
        doc.resumeList = doc.resumeList.concat({
            mallId:mallId
        })
        doc.save(function(err3, doc3) {
            if(err3){
                res.json({
                    status: "1",//0表示收藏成功，1表示操作失败，2表示删除成功
                    msg: "提交失败" + err3
                });
            }else{
                res.json({
                    status: "0",
                    msg: "收藏成功"
                });
            }
        })

    }
        // 如果集合不存在，创建集合
        if(doc==null){
            // 这里我原来是用let resumeList = [].push(1),打印发现resumeList是值是1，不是数组，什么情况
            let resumeList = [].concat({mallId:mallId})
            Collections.create({"userName": req.body.userName,"resumeList":resumeList}, function(err1, doc1) {
                if (err1) {
                    res.json({
                        status: "1",
                        msg: "收藏失败" + err1
                    });
                } else {
                    res.json({
                        status: "0",
                        msg: "收藏成功"
                    });
                }
            })
        }else{
            // 如果集合存在
            let content = doc.resumeList
            // 如果resumeList是空数组，说明，没有收藏任何模板，添加模板就行了
            if(content==""){
                collect()
            }else{
                // 如果resumeList有值，说明已经收藏模板，那要查询当前模板是否已经存在了
                for(var i=0;i<content.length;i++){
                    // 如果id已经存在，执行删除操作
                    if(mallId==content[i].mallId){
                        // 删除doc集合中，resumeList数组里面mallId属性值为mallId这一项
                        doc.update({$pull:{resumeList:{mallId:mallId}}},function(err2,doc2){
                            if(err2){
                                res.json({
                                    status: "1",
                                    msg: "取消收藏失败"+err2,

                                });
                            }else{
                                res.json({
                                    status: "2",
                                    msg: "取消收藏成功",

                                });
                            }
                    })
                    return false
                }
                }
                // 如果id存在，上面的return false会阻止这里的代码执行，所以这里写id不存在，进行添加的代码
                collect()
            }
        }
    })
});

// 读取收藏的简历图片
router.get('/getResume', function(req, res, next) {
    var param = {
        userName: req.param("userName"),
    }
    Collections.findOne(param, function(err, doc) {
         //如果没有收藏模板简历，返回空
          if(doc==[]||doc==null||doc==""){
              res.json({
              status: "1",
              msg: "抱歉，您没有收藏的简历",
              result: ""
          });
          return false
          }
        //如果有，找到每个简历的图片id，然后通过id去malls集合去匹配  
          let imgList=[];
          let content = doc.resumeList
          malls.find(function(err1, doc1) {
              if(err1){
                res.json({
                    status: "1",
                    msg: "查询失败"+err1,
                    result: ""
                });
              }else{
                  var collectList=[];
                  for(var t=0;t<content.length;t++){
                    for(var i=0;i<doc1.length;i++){
                      if(content[t].mallId==doc1[i].mallId){
                          collectList[t]=doc1[i]
                      }
                    }
                  }
                  res.json({
                    status: "0",
                    msg: "查询成功",
                    result: collectList
                });
              }
          })
    })
});

module.exports = router;
var express = require('express');
var router = express.Router();
var malls = require('./../models/mall')
var multer = require('multer');
let fs = require("fs");
let path = require("path");
var Collections = require('./../models/collection')

// 上传模板商城图片
router.post('/uploadImg', function(req, res, next) {
    malls.find(function(err, docs) {
        let params = {
            imgUrl: req.body.imgUrl,
            mallId: docs.length,
            indexs: docs.length
        }
        malls.create(params, function(err1, doc1) {
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
});

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
            // 需要查询下当前用户有没有收藏该模板，如果有的话要返回给用户
            
            Collections.findOne(Collect, function(err2, doc2) {
                // console.log(doc2.resumeList,"doc2")
                var list=[];
                for(var t=0;t<doc2.resumeList.length;t++){
                    for(var i=0;i<doc1.length;i++){
                            if(doc2.resumeList[t].mallId==doc1[i].mallId){
                            console.log("已经收藏",doc1[i].mallId)
                            doc1[i].collectText="已经收藏"
                            
                        }else{
                            console.log("收藏",doc1[i].mallId)
                            doc1[i].collectText="收藏"
                        }
                        list=list.concat(doc1[i])
                        // console.log(list,"list")
                    }
                }
            //     doc2.resumeList.forEach((item,index)=>{
            //          doc1.forEach((item1,index1)=>{
            //             if(item.mallId==item1.mallId){
            //                 console.log("已经收藏",item.mallId)
            //                 item1.collectText="已经收藏"
                            
            //             }else{
            //                 console.log("收藏",item.mallId)
            //                 item1.collectText="收藏"
            //             }
            //             list.concat(1)
            //             console.log(list,"list")

            // })
                    
            // })
            
            if (err1) {
                res.json({
                    status: "1",
                    msg: "获取失败"
                });
            } else {
                res.json({
                    status: "0",
                    msg: "获取成功",
                    result:{
                        list:list,
                        totol:totol
                    }
                });
            }
            })
            
            
            // doc1.forEach((item,index)=>{


            // })
            
        })
    })
 
});


module.exports = router;
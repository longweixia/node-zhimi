var express = require('express');
var router = express.Router();
var malls = require('./../models/mall')
var multer = require('multer');
let fs = require("fs");
let path = require("path");

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
    let skip = (currentPage-1)*pageSize//从哪一条开始查询
    let totol;//总条数
    malls.find().exec({},function(err0,doc0){
        totol = doc0.length;
        // 这个需要pageSize转换为数字，因为传过来成了字符串
        let allMall = malls.find().skip(skip).limit(Number(pageSize))
        allMall.exec({},function(err1,doc1){
            if (err1) {
                res.json({
                    status: "1",
                    msg: "获取失败" + err1
                });
            } else {
                res.json({
                    status: "0",
                    msg: "获取成功",
                    result:{
                        list:doc1,
                        totol:totol
                    }
                });
            }
        })
    })
 
});


module.exports = router;
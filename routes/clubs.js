var express = require('express');
var router = express.Router();
var clubs = require('./../models/club')
var multer = require('multer');
let fs = require("fs");
let path = require("path");
// var Collections = require('./../models/collection')

// 分享到社区
router.post('/share', function(req, res, next) {
    clubs.find(function(err, docs) {
        var params = {
            userName: req.body.userName
        }
        let userName = req.body.userName
        let Templated = req.body.Templated
        let list = {
            userName: userName,
            shareList: [Templated]
        }
        clubs.find(params, function(err0, doc0) {
            if (err0) {
                res.json({
                    status: "1",
                    msg: "分享失败" + err0
                });
                return false
            }
            if (doc0 == "") {
                clubs.create(list, function(err, doc) {
                    if (err) {
                        res.json({
                            status: "1",
                            msg: "分享失败" + err
                        });
                    } else {
                        res.json({
                            status: "0",
                            msg: "分享成功"
                        });
                    }
                })
            } else {
                let val = doc0[0].shareList
                //如果存在的话，不做操作
                if (val.indexOf(Templated) !== -1) {
                    res.json({
                        status: "1",
                        msg: "该简历已经分享过了"
                    });
                } else {
                    doc0[0].shareList.push(Templated)
                    doc0[0].save(function(err1, doc1) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: "分享失败" + err1
                            });
                        } else {
                            res.json({
                                status: "0",
                                msg: "分享成功"
                            });
                        }
                    })
                }
            }

        })
    })
});

// // 读取模板商城图片
// router.get('/getImgList', function(req, res, next) {
//     let pageSize = req.param("pageSize")
//     let currentPage = req.param("currentPage")
//     let Collect = { userName: req.param("userName") }
//     let skip = (currentPage - 1) * pageSize //从哪一条开始查询
//     let totol; //总条数
//     malls.find().exec({}, function(err0, doc0) {
//         totol = doc0.length;
//         // 这个需要pageSize转换为数字，因为传过来成了字符串
//         let allMall = malls.find().skip(skip).limit(Number(pageSize))
//         allMall.exec({}, function(err1, doc1) {
//             if (err1) {
//                 res.json({
//                     status: "1",
//                     msg: "查询失败" + err1,
//                     result: ""
//                 });
//                 return false
//             }
//             // 需要查询下当前用户有没有收藏该模板，如果有的话要返回给用户
//             Collections.findOne(Collect, function(err2, doc2) {
//                 // 如果查询收藏失败，直接返回模板商城数据
//                 if (err2) {
//                     res.json({
//                         status: "0",
//                         msg: "查询模板成功，查询是否收藏失败",
//                         result: doc1
//                     });
//                     return false
//                 }
//                 //注意： 这里发现直接给doc1加上collectText属性，加不上。所以，深克隆一份，给新对象挂载属性
//                 var doc1b = JSON.parse(JSON.stringify(doc1))
//                 doc1b.forEach(item => {
//                     item.collectText = "收藏"
//                 });
//                 // 如果用户没有收藏，则给每个模板加上collectText:"收藏"
//                 if (doc2 == [] || doc2 == null || doc2 == "") {
//                     res.json({
//                         status: "1",
//                         msg: "抱歉，您没有收藏的简历",
//                         result: { list: doc1b, totol: totol }
//                     });
//                 } else {

//                     for (var t = 0; t < doc2.resumeList.length; t++) {
//                         for (var i = 0; i < doc1b.length; i++) {
//                             if (doc2.resumeList[t].mallId == doc1b[i].mallId) {
//                                 console.log("已经收藏", doc1b[i].mallId)
//                                 //注意： doc1[i].collectText="已经收藏" ，这样添加属性是不生效的，只能给克隆对象添加
//                                 doc1b[i].collectText = "已收藏"

//                             }
//                         }
//                     }
//                     res.json({
//                         status: "0",
//                         msg: "获取成功",
//                         result: {
//                             list: doc1b,
//                             totol: totol
//                         }
//                     });
//                 }
//             })
//         })
//     })

// });


module.exports = router;
var express = require('express');
var router = express.Router();
var Chart = require('./../models/chart')
let fs = require("fs");
let portrait = fs.readdirSync('./public/static/portrait')
let emoji = fs.readdirSync('./public/static/emoticon/emoji')
let emot = fs.readdirSync('./public/static/emoticon/emot')
// 读取私聊列表
router.get('/getoneCharts', function(req, res, next) {
    var param ={
        userId:req.param("userId")
    }
    Chart.findOne(param,function(err0,doc0){
        if(err0){
            res.json({
                status: "1",
                msg: "查询失败" + err0
            });
        }
        else{
            if(!doc0){
                res.json({
                    status: "0",
                    msg: "无数据" 
                });
                return false
            }
            res.json({
                status: "0",
                msg: "成功" ,
                result:doc0.onechartList
            });
        }
    })
    res.send({
        status: "0",
        result: {
            portrait,
            emoji,
            emot
        }
    })
});
// 查询图片，资源，头像
router.get('/getChatImgList', function(req, res, next) {
    res.send({
        status: "0",
        result: {
            portrait,
            emoji,
            emot
        }
    })
});
// 收藏/取消简历模板
router.post('/postChartList', function(req, res, next) {
    var userName = req.body.userName
    var param = {
        userName: userName
    }
    var intoName = req.body.intoName
    var params = {
        "userName": userName,
        "list": [
            { intoName: intoName }
        ]
    }
    Chart.findOne(param, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: "提交失败" + err
            });
        } else {
            // 集合不存在，创建
            if (!doc) {
                Chart.create(params, function(err1, doc1) {
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
            } else {
                // 集合存在
                //该用户存在
                for (var i = 0; i < doc.list.length; i++) {
                    if (intoName == doc.list[0].intoName) {
                        res.json({
                            status: "1",
                            msg: "该用户已经联系过了"
                        });
                        return false
                    }
                }
                // 该用户不存在
                doc.list.push( { intoName: intoName })
                doc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: "保存失败," + err2
                    })
                  } else {
                    res.json({
                      status: "0",
                      msg: "保存成功"
                    })
                  }
                })
            }
        }


    })
});



module.exports = router;
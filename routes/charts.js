var express = require('express');
var router = express.Router();
var Chart = require('./../models/chart')
let fs = require("fs");
let portrait = fs.readdirSync('./public/static/portrait')
let emoji = fs.readdirSync('./public/static/emoticon/emoji')
let emot = fs.readdirSync('./public/static/emoticon/emot')
// 读取私聊列表
router.get('/getOneCharts', function(req, res, next) {
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
                    status: "2",
                    msg: "无数据" 
                });
                return false
            }
            res.json({
                status: "0",
                msg: "成功" ,
                result:doc0.oneChartList
            });
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
router.post('/postOneCharts', function(req, res, next) {
    var data = req.body.data
    var userName = data.userName
    var userId = data.userId
    var chartName = data.chartName
    var chartId = data.chartId
    var chartNameHead = data.chartNameHead
    var flag = data.flag
    var params = {
        userName: userName,
        oneChartList:[]
    }
    var param = {
        userId:userId
    }

    Chart.findOne(param, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: "提交失败" + err
            });
            return false
        } 
            // 集合不存在，创建
            if (flag=="findchat") {
                        res.json({
                            status: "0",
                            msg: "联系人存在了",
                            result:doc
                        });
                        return false
              
            } 
                // 集合存在
                //该用户存在
                for (var i = 0; i < doc.oneChartList.length; i++) {
                    if (doc.oneChartList[i].chartId == chartId) {
                        res.json({
                            status: "0",
                            msg: "该用户已经联系过了",
                            result:doc
                        });
                        return false
                    }
                }
                let datas ={
                    chatId:chartId,
                    chartName:chartName,
                    chartNameHead:chartNameHead,
                    siLiaoNum:0,
                    chatIdList:[],
                }
               doc.oneChartList.push(datas)
               doc.save(function(err2,doc2){
                res.json({
                    status: "0",
                    msg: "新增成功",
                    result:doc2
                });
               })
            
        


    })
});



module.exports = router;
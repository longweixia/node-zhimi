var express = require('express');
var router = express.Router();
var clubs = require('./../models/club')
var resumeTemplates = require('./../models/resumeTemplate')
var multer = require('multer');
let fs = require("fs");
let path = require("path");
var Collections = require('./../models/collection')


// 分享/取消分享到社区
// 需要注意的是一个人只能同时分享一份简历数据
router.post('/share', function(req, res, next) {
    let userName = req.body.userName
    let Templated = req.body.Templated
    let userImg = req.body.userImg
    let userId = req.body.userId
    var list = {
        userName: userName,
        userId:userId,
        userImg:userImg,
        shareList: {
            Templated: Templated,
            baseInfoList: {
             
            }
        }
    }
    var baseInfoList = {};
    var params = {
        userName: userName
    }
    // 分享的时候，把简历的baseinfo信息分享过去
    resumeTemplates.find(params).exec({}, function(err4, doc4) {
        doc4[0].resumeTemplate.forEach((item, index) => {
            // 找到用户要分享的简历ID的基本信息
            if (Templated == item.TemplateId) {
                baseInfoList = item.resumeContent.baseInfoList
                list.shareList.baseInfoList = baseInfoList
                list.shareList.baseInfoList.SkillList=[]
                list.shareList.baseInfoList.SkillList.push(item.resumeContent.SkillList)
                // baseInfoList.skillList= item.resumeContent.SkillList
                clubs.find(params, function(err1, doc1) {
                    if (err1) {
                        res.json({
                            status: "1",
                            msg: "分享失败" + err1
                        });
                        return false
                    }
                    // 再将baseinfo绑定到分享的集合中用户的id
                    // 如果一开始是空的，就直接创建集合
                    if (doc1 == "") {
                        // list.shareList.baseInfoList = baseInfoList
                        
                        clubs.create(list, function(err2, doc2) {
                            if (err2) {
                                res.json({
                                    status: "1",
                                    msg: "分享失败" + err2
                                });
                            } else {
                                res.json({
                                    status: "0",
                                    msg: "分享成功"
                                });
                            }
                        })
                    } else {
                        // 如果不是空的
                        let val = doc1[0].shareList
                        //如果存在的话，就删除他
                        if (val.Templated == Templated) {
                            doc1[0].shareList = {}
                            doc1[0].save(function(err4, doc4) {
                                if (err4) {
                                    res.json({
                                        status: "2",
                                        msg: "取消分享失败" + err4
                                    });
                                } else {
                                    res.json({
                                        status: "3",
                                        msg: "取消分享成功"
                                    });
                                }
                            })
                            return false
                        }

                        // 如果不存在的话
                        doc1[0].shareList = { Templated: Templated, baseInfoList: baseInfoList }
                        doc1[0].save(function(err3, doc3) {
                            if (err3) {
                                res.json({
                                    status: "1",
                                    msg: "分享失败" + err3
                                });
                            } else {
                                res.json({
                                    status: "0",
                                    msg: "分享成功"
                                });
                            }
                        })
                    }
                })
            }
        });
    })
});

// 读取某个用户社区分享的简历
router.get('/getClubList', function(req, res, next) {
    let params = { userName: req.param("userName") }
    clubs.find(params).exec({}, function(err0, doc0) {
        if (err0) {
            res.json({
                status: "1",
                msg: "查询失败" + err0,
                result: ""
            });
        } else {
            res.json({
                status: "0",
                msg: "查询成功",
                result: doc0[0].shareList.baseInfoList
            });
        }
    })

});
// 读取所有用户社区分享的简历
router.get('/getAllClubList', function(req, res, next) {
    clubs.find().exec({}, function(err0, doc0) {
        if (err0) {
            res.json({
                status: "1",
                msg: "查询失败" + err0,
                result: ""
            });
        } else {
            let datas = [];
            doc0.forEach((item, index) => {
                item.shareList.baseInfoList.userName = item.userImg
                item.shareList.baseInfoList.userImg = item.userImg
                item.shareList.baseInfoList.userId = item.userId
                item.shareList.baseInfoList.TemplateId = item.TemplateId
                datas.push(item.shareList.baseInfoList)
            })
            res.json({
                status: "0",
                msg: "查询成功",
                result: datas
            });
        }
    })
});

module.exports = router;
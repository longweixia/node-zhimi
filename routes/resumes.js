var express = require('express');
var router = express.Router();
var Resume = require('./../models/resume')


// 提交简历信息
router.post('/resumeInfo', function (req, res, next) {
    var param = {
        userName:req.body.userName,
        content:req.body.content,
        creatTime:(new Date).toString()
      }
      Resume.create(param, function (err, doc) {
        if (err) {
          res.json({
            status: "1",
            msg: "注提交失败" + err
          });
        } else {
          res.json({
            status: "0",
            msg: "提交成功",
            result:doc
          });
        }
      })
});
// 读取简历信息
router.post('/getResumeInfo', function (req, res, next) {
    var param = {
        userName:req.body.userName,
      }
      Resume.findOne(param, function (err, doc) {
        if (err) {
          res.json({
            status: "1",
            msg: "查询简历信息失败" + err
          });
        } else {
          res.json({
            status: "0",
            msg: "查询成功",
            result:doc
          });
        }
      })
});



module.exports = router;
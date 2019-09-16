var express = require('express');
var router = express.Router();
// var ResumeImg = require('./../models/resumeImg')
var multer = require('multer');
let fs = require("fs");
let path = require("path");

// 读取图片
router.get('/resumeImgList', function(req, res, next) {
    // var paramas = req.flag;
    // const {resolve} = require('path')
    // console.log('__dirname : ' + __dirname)
    // console.log('resolve   : ' + resolve('./'))
    var resumePath = process.cwd() //当前命令所在的目录F:\myproject\zhimi\node-zhimi
    var url = []; //图片url列表数组
    console.log('cwd:' + resumePath)
    fs.readdir(resumePath + "/public/images", function(err, files) {
      console.log(err,"err")
        if (err) {
            res.json({
                status: "1",
                msg: "查询文件失败" + err
            });
        } else {
            files.forEach(function(file) {
                url.push(resumePath + "/public/images/" + file)
            });
            // if (paramas == "all") {
                res.json({
                    status: "0",
                    msg: "查询图片列表成功",
                    result: files,
                    url: url
                });
            // }

        }

    });
});


module.exports = router;
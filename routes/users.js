var express = require('express');
var router = express.Router();
var User = require('./../models/user')
// 连接mongodb数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/demo',{useMongoClient:true})

mongoose.connection.on("connected",function(){
    console.log("mongodb连接成功")
})
mongoose.connection.on("error",function(){
    console.log("mongodb连接失败")
})
mongoose.connection.on("disconnected",function(){
    console.log("mongodb连接disconnected")
})
/* GET users listing. */
router.post('/login', function(req, res, next) {
  //登录接口  查找某一个用户，根据用户密码   doc 是用户文档  
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (doc) {
        // 写cookie
        res.cookie("userId", doc.userId, {
          path: "/",
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 60
        })
        // 存到session  需要安装插件才能用的 express-session
        // req.session.user = doc
        res.json({
          status: "1",
          msg: "",
          result: {
            userName: doc.userName
          }
        })
      }
    }

  })
});

module.exports = router;

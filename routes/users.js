var express = require('express');
var router = express.Router();
var User = require('./../models/user')
// 连接mongodb数据库
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // 使用jwt签名
mongoose.connect('mongodb://localhost:27017/zhimi', {
  useMongoClient: true
})

mongoose.connection.on("connected", function () {
  console.log("mongodb连接成功")
})
mongoose.connection.on("error", function () {
  console.log("mongodb连接失败")
})
mongoose.connection.on("disconnected", function () {
  console.log("mongodb连接disconnected")
})

// 登录接口
router.post('/login', function (req, res, next) {
  //  查找某一个用户，根据用户密码   doc 是用户文档  
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: "登录失败，" + err
      });
    } else {
      // 暂时不用cookie的方式做认证
      // res.cookie("userId", doc.userId, {
      //   path: "/",
      //   maxAge: 1000 * 60 * 60
      // });
      // res.cookie("userName", doc.userName, {
      //   path: "/",
      //   maxAge: 1000 * 60 * 60
      // })
      let content = param; // 要生成token的主题信息
      let secretOrPrivateKey = "long" // 这是加密的key（密钥） 
      let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60 * 1 * 1 // 1分钟过期
      });
      doc.token = token
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: "登录失败," + err1
          })
        } else {
          res.json({
            status: "0",
            msg: "登录成功",
            result: doc1.token
          })
        }
      })
    }

  })
});

// 校验接口
router.post('/checkLogin', function (req, res, next) {
  var token = req.body.token
  var param = {
    token:token
  }

  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: "token不存在或者失效，" + err
      });
    } else {
      jwt.verify(token, "long", function (err, decode) {
        if (err) { //  时间失效的时候/ 伪造的token          
          res.json({
            status: "1",
            msg: "token不存在或者失效",
            result: doc?doc.token:""
          })
        } else {
          res.json({
            status: "0",
            msg: "token正常",
            result: doc.userName
          })
        }
      })

      //     res.json({
      //       status: "1",
      //       msg: "token不存在或者失效",
      //       result:doc
      //     })
      //   }else{
      //   res.json({
      //     status: "0",
      //     msg: "token正常",
      //     result:doc.userName
      //   })
      // }
    }
  })
});

module.exports = router;
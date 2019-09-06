var express = require('express');
var router = express.Router();
var User = require('./../models/user')
// 连接mongodb数据库
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // 使用jwt签名
mongoose.connect('mongodb://localhost:27017/zhimi'
// , {
//   useMongoClient: true
// }
)

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
      // 注意需要doc是否存在，如果不存在这个用户那么doc是null,doc1也是null,doc1.token就会报错
      if(!doc){
        res.json({
          status: "1",
          msg: "用户名或密码错误"
          // result: doc
        })
      }else{
        let content = param; // 要生成token的主题信息
        let secretOrPrivateKey = "long" // 这是加密的key（密钥） 
        let token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: 60 * 60 * 1 // 1分钟过期
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
      jwt.verify(token, "long", function (err, doc1) {
        if (err) { //  时间失效的时候/ 伪造的token          
          res.json({
            status: "1",
            msg: "token不存在或者失效"
            // result: doc?doc.token:""
          })
        } else {
          res.json({
            status: "0",
            msg: "token正常",
            result: doc1.userName
          })
        }
      })
    }
  })
});

// 退出接口
router.post('/loginOut', function (req, res, next) {
  var param = {
    userName:req.body.userName
  }

  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: "退出失败" + err
      });
    } else {
   doc.token="";
   doc.save(function (err1, doc1) {
    if (err1) {
      res.json({
        status: "1",
        msg: "退出失败," + err1
      })
    } else {
      res.json({
        status: "0",
        msg: "退出成功"
      })
    }
  })
    }
  })
});
// 注册接口
router.post('/register', function (req, res, next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd,
    creatTime:(new Date).toString()
  }
  let content = param; // 要生成token的主题信息
  let secretOrPrivateKey = "long" // 这是加密的key（密钥） 
  let token = jwt.sign(content, secretOrPrivateKey, {
    expiresIn: 60 * 60 * 1 // 1小时过期
  });
  var params = {
    userId:Math.floor(Math.random()*100),
    userName:req.body.userName,
    userPwd:req.body.userPwd,
    token:token,
    creatTime:(new Date).toString()
  }
// 先判断用户名是否存在
  User.findOne({userName:req.body.userName}, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: "注册失败" + err
      });
    } else {
       // 不存在才创建用户
      if(!doc){
        User.create(params, function (err1, doc1) {
          if (err1) {
            res.json({
              status: "1",
              msg: "注册失败" + err1
            });
          } else {
            res.json({
              status: "0",
              msg: "注册成功",
              result:doc1.token
            });
          }
        })
      }else{ // 存在就报错，用户存在
        res.json({
          status: "1",
          msg: "用户名存在"
        });
      }
    }
  })

});

module.exports = router;
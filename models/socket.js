// socket 案例
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('node-zhimi:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var socket = require('socket.io');
var io = socket(server);
var users = ["long", "wei"] //存储已经注册用户
var usersa = [] //存储聊天用户
var usersInfo = []; // 存储用户姓名和头像

// 连接socket
//监听客户端连接
io.on('connection', function (socket) {
  // 接收客户端传递过来的登录
  socket.on('logins', (user) => {
console.log(user,"=====用户")
    if (users.indexOf(user.name) == -1) {
      console.log("用户不存在")
      // 传递登录失败给客户端
      socket.emit('loginError');
    } else {
      usersa.push(user.name);
      usersInfo.push(user);

      // 传递登录成功给客户端
      socket.emit('loginSuc');

      socket.nickname = user.name;
      // 传递系统通知，系统通知直接用io,通知用户进入房间
      io.emit('system', {
        name: user.name,
        status: '进入'
      });
      // 传递显示用户
      io.emit('showOnlineUser', usersInfo);

      // 接收客户端传递过来的消息
      // 发送消息事件
    socket.on('sendMsg', (data)=> {
      console.log(data,"接收到的消息")
      var img = '';
      // 拿到指定用户对应的图像
      for(var i = 0; i < usersInfo.length; i++) {
          if(usersInfo[i].name == socket.nickname) {
              img = usersInfo[i].img;
          }
      }
      //给除了自己以外的客户端广播消息,一般用于显示发送给对方的消息
      socket.broadcast.emit('receiveMsg', {
          name: socket.nickname,
          img: img,
          msg: data.msg,
          color: data.color,
          type: data.type,
          side: 'left'
      });
      //给所有客户端广播消息，用于显示所有发送的消息，自己和别人都可见
      socket.emit('receiveMsg', {
          name: socket.nickname,
          img: img,
          msg: data.msg,
          color: data.color,
          type: data.type,
          side: 'right'
      });
  });  


    }
  })



});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}
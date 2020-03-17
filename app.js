var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser") // 处理前端传过来的数据

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resumesRouter = require('./routes/resumes');
var resumesImgRouter = require('./routes/resumeImgs');
var resumeTemplatesRouter = require('./routes/resumeTemplates');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
// 下面两项设置文件上传的大小限制为50m，不写的话可能会因为文件超过3m而报413
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(cookieParser());
// 这里配置了静态资源，所以访问图片直接http://localhost:3000/images/homeList1.png可以拿到
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/resumes', resumesRouter);
app.use('/resumeTemplates', resumeTemplatesRouter);
app.use('/resumeImgs', resumesImgRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

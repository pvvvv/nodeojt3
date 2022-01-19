var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var passport = require("passport");

var { swaggerUi, specs } = require('./config/swagger');
var indexRouter = require('./routes/index');
var schedulerRouter = require('./routes/scheduler/index');
var userRouter = require('./routes/user/index');
var passportConfig = require('./config/passport');
var {sequelize} = require('./models');
const logger = require('./config/logger');

var app = express();
//sequelize.sync({ force: true }); //테이블 생성할때 한번 사용. 잘못쓰면 데이터 날아감

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile); // html을 ejs로 렌더링
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', indexRouter);

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
  res.render(err);
});

module.exports = app;

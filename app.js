var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var { sequelize } = require('./models');
var logger = require('./config/logger');
var batch = require('./lib/batch-scheduler');

var app = express();
sequelize.sync({ force: false }); //테이블 생성할때 한번 사용. 잘못쓰면 데이터 날아감
batch.scheduleBackup();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    logger.error(err);
    // render the error page
    res.status(err.status || 500);
    res.render(err);
});

module.exports = app;

require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var calendar = require('./routes/calendar.js');
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/accounts');
var loginRouter = require('./routes/login')
var app = express();
var cors = require('cors');

app.use(cors());
require('./services/database');

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/accounts', accountRouter);
app.use('/login', loginRouter);
app.use('/calendars', calendar);

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

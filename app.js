var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var ajax_nav_steuerung = require('./routes/ajax_nav_steuerung');
var ajax_nav_heizung = require('./routes/ajax_nav_heizung');
var ajax_nav_zaehler = require('./routes/ajax_nav_zaehler');
var ajax_nav_alarm = require('./routes/ajax_nav_alarm');
var ajax_nav_home = require('./routes/ajax_nav_home');
var ajax_nav_sensor = require('./routes/ajax_nav_sensor');
var ajax_nav_alarmclock = require('./routes/ajax_nav_alarmclock');
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// damit jquery und andere Dateien vom Server gelesen werden können
app.use(express.static(path.join(__dirname, 'public')));

// Http-Anfragen beantworten
app.use('/', index);

// es ist ein Punkt in nav (Navigationbar) angewählt worden
app.post('/ajax_nav_steuerung.js', ajax_nav_steuerung);
app.post('/ajax_nav_heizung.js', ajax_nav_heizung);
app.post('/ajax_nav_zaehler.js', ajax_nav_zaehler);
app.post('/ajax_nav_alarm.js', ajax_nav_alarm);
app.post('/ajax_nav_home.js', ajax_nav_home);
app.post('/ajax_nav_sensor.js', ajax_nav_sensor);
app.post('/ajax_nav_alarmclock.js', ajax_nav_alarmclock);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// muss angegeben werden damit die jquery, Bilder usw in dem Verzeichnis public 
// geladen werden können !!!!!
app.use(express.static ('public'));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Display error 
  res.status(err.status || 500);
  res.end(err.status + err.stack);

});

module.exports = app;

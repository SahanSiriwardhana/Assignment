var createError = require('http-errors');
var express = require('express');

// Import Body parser
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



// Import routes
let apiRoutes = require("./routes/api-routes");
var usersRouter = require('./routes/users');
var landsRouter = require('./routes/lands');
// Setup server port
var port = process.env.PORT || 8080;
var app = express();
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors())
app.use('/uploads',express.static('uploads'))
// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
mongoose.connect('mongodb://localhost/TestDb', { useNewUrlParser: true});

var db = mongoose.connection;
// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// Use Api routes in the App
app.use('/api', apiRoutes)
app.use('/users', usersRouter);
app.use('/lands',landsRouter);
app.get('/login',function(req,res,next){
  res.send('This is from login');
});

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

app.listen(port, function () {
  console.log("Running host on port " + port);
});

module.exports = app;

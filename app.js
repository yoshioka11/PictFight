var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

// var post = require('./routes/post');
var mongoose = require('mongoose');
var date = require('date-utils');
var connection = mongoose.connect('mongodb://heroku_k768q4pd:udancbo9374hdksbnqi3a6pgie@ds149329.mlab.com:49329/heroku_k768q4pd');
//DBのlistIDでauto incrementを使いたいので定義
var autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(connection);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var character = ["images/dwarf.png","images/elf.png","images/man.png","images/woman.png"];

//内容スキーマ設計(チェック,内容,作成日,期限)
var Schema = mongoose.Schema;
var userSchema = new Schema({
  userName     : String,
  password     : String,
  createdDate : {type: Date, default: Date.now},
  character  : String,
  pussive : Number,
  win : {type:Number ,default: 0},
  lose : {type:Number ,default: 0}
});
userSchema.plugin(autoIncrement.plugin, {model:'User',field:'userId'});
mongoose.model('User', userSchema);
var User = mongoose.model('User');

//ログインチェック登録しているIDとパスワードであれば値を返す。でなければfalse
app.post('/loginCheck',function(req,res){
  var userName = req.body.userName;
  var password  = req.body.password;
  console.log("userName:"+userName);
  console.log("password:"+password);
  User.find({userName:userName,password:password},function(err,check){
    if(check.length){
      res.send(check);
    }else{
      res.send(false);
    }
  });
});

//新しく登録する。IDが被っていないかつIdが３文字以上かつpasswordが４文字以上ならtrue
app.post('/createUser',function(req,res){
  var userName = req.body.userName;
  var password = req.body.password;
  var pussive = req.body.pussive;
  var character = req.body.character;
  console.log(userName,password,pussive,character);
  User.find({userName:userName},function(err,check){
    console.log(check);
    if(check.length){
      res.send(false);
      console.log("重複");
    }else{
      var user = new User();

      user.userName = userName;
      user.password = password;
      user.pussive = pussive;
      user.character = character;
      user.save();
      res.send(true);
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

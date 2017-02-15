var express = require('express');
var session = require('express-session');



exports.top = function(req,res){
  if(req.session.user){
    res.render('top',{user:req.session.user});
    console.log("セッション残っとるよ");
  }else{
    console.log("成功");
    res.render('top',{user:0});
  }
}

exports.room = function(req,res){
  res.render('room',{id:req.params.id});
}

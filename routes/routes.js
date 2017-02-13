var express = require('express');


exports.top = function(req,res){
  res.render('top');
}

exports.room = function(req,res){
  res.render('room',{id:req.params.id});
}

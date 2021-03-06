var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념

// Home
router.get("/", function(req, res){
  res.render("home/gamehome");
});

router.get('/main/singleMatch', function(req, res){
  res.render("pages/single_match");
});

router.get("/test1", function(req, res){
  res.render("htable/test1");
});

router.get("/test9", function(req, res){
  res.render("htable/test9");
});

router.get("/about", function(req, res){
  res.render("gbooks/index");
});

// Login
router.get('/login', function (req,res) {
  res.render('login/login',{username:req.flash("username")[0], loginError:req.flash('loginError'), loginMessage:req.flash('loginMessage')});
});

// Post Login 인증-passport.authenticate함수호출 data from login.ejs form
router.post('/login',
  passport.authenticate(
    'local-login',
    {
    successRedirect : '/',  // 인증성공시
    failureRedirect : '/login', // 인증실패시
    failureFlash : true         // 인증실패시 보여줄 메세지
    }
  )
);

// Logout
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("postsMessage", "Good-bye, have a nice day!");
    res.redirect('/');
});

module.exports = router;

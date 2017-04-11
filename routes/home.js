var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념

// Home
router.get("/", function(req, res){
  res.render("home/welcome");
});
router.get("/about", function(req, res){
  res.render("home/about");
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
    successRedirect : '/posts',  // 인증성공시
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

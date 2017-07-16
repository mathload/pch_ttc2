var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var rbsm = require('../models/md_sm_rb');


// Home
router.get("/:id", function(req, res){
  var pListi = [];
  var hcol = [];
  var hlow = [];
  var rsf = [];
  rbsm.find({ $or:[
    {'matchid':'2001-rb-sm-170618-1조'},
    {'matchid':'2002-rb-sm-170618-2조'},
    {'matchid':'2003-rb-sm-170618-3조'}
    ]},
    {_id:0, rbsmplist:1}, function(err, results){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "matchid";
    results.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });

    for(i=0; i<3; i++){
          pListi[i] = results[i].rbsmplist;
          rsf = maketableheader(pListi[i]);
          hcol[i] = rsf[0];
          hlow[i] = rsf[1];
    }

  res.render("pastgame/2017-06-18", {pList:pListi, hlow:hlow,hcol:hcol});
  });
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


function  maketableheader(tabledataArr){
  var rhcol = [];
  var rhlow = [];
  var count;
  var rs =[];
  count = tabledataArr.length;
  rhlow[0]='';
  for(var i=0; i<count; i++) {
    rhlow[i+1]=i+1;
    rhcol[i] = '';
  };
  rhcol[count] = '승점(승-패)';
  rhcol[count+1] = '순위';
  rs.push(rhcol);
  rs.push(rhlow);
  return rs;
}

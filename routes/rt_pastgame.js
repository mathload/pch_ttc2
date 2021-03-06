var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var rbsm = require('../models/md_sm_rb');
var mtnt_all = require('../models/md-tntbracket_all');

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

router.get("/2017/2017-07-16", function(req, res){
  var pListi = [];
  var hcol = [];
  var hlow = [];
  var rsf = [];
  rbsm.find({ $or:[
    {'matchid':'2004-rb-sm-170716-1조'},
    {'matchid':'2005-rb-sm-170716-2조'}
    ]},
    {_id:0, rbsmplist:1}, function(err, results){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "matchid";
    results.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });

    for(i=0; i<2; i++){
          pListi[i] = results[i].rbsmplist;
          rsf = maketableheader(pListi[i]);
          hcol[i] = rsf[0];
          hlow[i] = rsf[1];
    }
    mtnt_all.find({ $or:[
      {'gameid':'2006-tnttm-8-170716-상위부'},
      {'gameid':'2007-tnttm-8-170716-하위부'}
      ]},
      {_id:0, tnt_all:1}, function(err, tresults){
      if(err) return res.status(500).send({error: 'database find failure'});
      var sortingField = "gameid";
      tresults.sort(function(a, b) { // 내림차순
          return b[sortingField] - a[sortingField];
      });

        pListi[2] = tresults[0].tnt_all;
        pListi[3] = tresults[1].tnt_all;
  res.render("pastgame/2017-07-16", {pList:pListi, hlow:hlow,hcol:hcol});
  });
      });
});


router.get("/2017/2017-08-20", function(req, res){
  var pListi = [];
  var hcol = [];
  var hlow = [];
  var rsf = [];
  rbsm.find({ $or:[
    {'matchid':'2008-rb-sm-170820-1조'},
    {'matchid':'2009-rb-sm-170820-2조'},
    {'matchid':'2010-rb-sm-170820-3조'},
    {'matchid':'2011-rb-sm-170820-4조'}
    ]},
    {_id:0, rbsmplist:1}, function(err, results){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "matchid";
    results.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });

    for(i=0; i<4; i++){
          pListi[i] = results[i].rbsmplist;
          rsf = maketableheader(pListi[i]);
          hcol[i] = rsf[0];
          hlow[i] = rsf[1];
    }
    mtnt_all.find({ $or:[
      {'gameid':'2012-tntsm-16-170820-상위부'},
      {'gameid':'2013-tntsm-16-170820-하위부'}
      ]},
      {_id:0, tnt_all:1}, function(err, tresults){
      if(err) return res.status(500).send({error: 'database find failure'});
      var sortingField = "gameid";
      tresults.sort(function(a, b) { // 내림차순
          return b[sortingField] - a[sortingField];
      });

        pListi[4] = tresults[0].tnt_all;
        pListi[5] = tresults[1].tnt_all;
  res.render("pastgame/2017-08-20", {pList:pListi, hlow:hlow,hcol:hcol});
  });
      });
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

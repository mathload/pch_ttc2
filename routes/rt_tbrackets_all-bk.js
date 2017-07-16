var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var tntbrkt_low16ff = require('../models/tntbrkt_low16ff');
var md_gRank = require('../models/md_groupRank');
var mtnt_all = require('../models/md-tntbracket_all');

// router.get("/:id", isLoggedIn, function(req, res){
  router.get("/:id", function(req, res){

  // var starter = new mtnt_all;
  // starter.gameid = req.params.id;
  // var snt ={
  //   teams : 'mone',
  //   results : 'win'
  // }
  // starter.tnt_all = snt;
  // starter.save(function(err, starters){
  //     if(err) return console.error(err);
  // }); // resultSet.save
  mtnt_all.find({gameid: req.params.id}, {_id:0, tnt_all:1, gameid:1}, function(err, mtnt_alls){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
   ts = mtnt_alls[0].tnt_all;
   tntid = req.params.id;
   //console.log('ts= ' + JSON.stringify(ts));
    res.render("gbrackets/vw_tnt_all", {sdata:ts, tntid:tntid, user:req.user});
    });
});



// router.get("/:id", isLoggedIn, function(req, res){
  router.get("/test/makebarcket", function(req, res){
    mtnt_all.find({gameid: '9993-tnt-32-170710-테스트'}, {_id:0, tnt_all:1, gameid:1}, function(err, mtnt_alls){
      if(err) return res.status(500).send({error: 'database find failure'});
      var ts;
     ts = mtnt_alls[0].tnt_all;
    //  tntid = req.params.id;
     //console.log('ts= ' + JSON.stringify(ts));
     var seedArr = seeding(8);
     var orderArr = order_group2(3);
     var coupledArr = coupling(seedArr,orderArr);
     console.log('seedArr= ' + seedArr);
     console.log('orderArr= ' + orderArr);
      console.log('coupledArr= ' + coupledArr);
      res.render("gbrackets/vw_tnt_make", {sdata:ts});
      });
});





function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("gbooksMessage","Please login first.");
  res.redirect('/gbooks');
 }



 function seeding(numPlayers){
  //  var rounds = Math.log(numPlayers)/Math.log(2)-1;
  //  var pls = [1,2];
  //  for(var i=0;i<rounds;i++){
  //    pls = nextLayer(pls);
  //  }
  //  return pls;
  //  function nextLayer(pls){
  //    var out=[];
  //    var length = pls.length*2+1;
  //    pls.forEach(function(d){
  //      out.push(d);
  //      out.push(length-d);
  //    });
  //    return out;
  //  }


   var out=[];
   if(numPlayers == 2){
     out = [1,2];
   }
   if(numPlayers == 4){
     out = [1,4,3,2];
   }
   if(numPlayers == 8){
     out = [1,8,5,4,3,6,7,2];
   }
   if(numPlayers == 16){
     out = [1,16,9,8,5,12,13,4,3,14,11,6,7,10,15,2];
   }
   if(numPlayers == 32){
     out = [1,32,17,16,9,24,25,8,5,28,21,12,13,20,29,4,3,30,19,14,11,22,27,6,7,26,23,10,15,18,31,2];
   }
   if(numPlayers == 64){
     out = [1,64,33,32,17,48,49,16,9,56,41,24,25,40,57,8,5,60,37,28,21,44,53,12,13,52,45,20,29,36,61,4,
            3,62,35,30,19,46,51,14,11,54,43,22,27,38,59,6,7,58,39,26,23,42,55,10,15,50,47,18,31,34,63,2];
   }

  return out;
 }

function order_group2(numgroup){
  var out=[];
  for(i=0; i<numgroup; i++){
    for(j=0; j<2; j++){
      out.push((j+1)+'-'+(i+1));
    }
  }
  return out;
}

function coupling(sarr,oarr){
  var out=[];
  for(i=0; i<sarr.length; i++){
    for(j=1; j<sarr.length+1; j++){
      if(sarr[i]==j){
        out.push(oarr[j-1]);
      }
    }
  }
  return out;
}


module.exports = router;

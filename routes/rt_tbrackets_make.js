var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var md_gRank = require('../models/md_groupRank');
var mtnt_all = require('../models/md-tntbracket_all');
var rbsm = require('../models/md_sm_rb');

router.get("/:id", isLoggedIn, function(req, res){

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
   var strarr = req.params.id.split('-');
   gamename = strarr[4]
   tntid = req.params.id ;
   //console.log('ts= ' + JSON.stringify(ts));
    res.render("gbrackets/vw_tnt_all", {sdata:ts,gamename:gamename, tntid:tntid, user:req.user});
    });
});


router.get("/", isLoggedIn, function(req, res){
  // var starter = new tntbrkt_low16ff;
  // starter.gid = 31;
  // var snt ={
  //   teams : 'mone',
  //   results : 'win'
  // }
  // starter.tnt_l16ff = snt;
  // starter.save(function(err, starters){
  //     if(err) return console.error(err);
  // }); // resultSet.save
  tntbrkt_low16ff.find({}, {_id:0}, function(err, tntbrkt_low16ffs){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
   ts = tntbrkt_low16ffs[0].tnt_l16ff;
    res.render("gbrackets/vw_tnt_all", {sdata:ts, user:req.user});
    });
});

router.post('/:id', isLoggedIn, function(req,res){
  try {
  var jsondata = JSON.parse(req.body.tdata);
  //console.log('라우터'+req.body.tdata);
  mtnt_all.findOneAndUpdate({gameid: req.params.id},
    {tnt_all:jsondata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, tnt_alls) {
      if(error){
          console.log("Something wrong when updating data!");
      }
       var ts;
       ts = tnt_alls.tnt_all;
       tntid = tnt_alls.gameid;
        res.render("gbrackets/vw_tnt_all", {sdata:ts, tntid:tntid, user:req.user});
    });
  }
  catch(err) {
    //console.log('라우터data오류'+jsondata);
    // return res.redirect("tbrackets");
    return res.redirect("back");
  };
});

// router.get("/:id", isLoggedIn, function(req, res){
  router.get("/test/makebarcket/:id", function(req, res){
    mtnt_all.find({gameid: '9993-tnt-32-170710-테스트'}, {_id:0, tnt_all:1, gameid:1}, function(err, mtnt_alls){
      if(err) return res.status(500).send({error: 'database find failure'});
      var ts;
     ts = mtnt_alls[0].tnt_all;
     tntid = req.params.id;
     //console.log('ts= ' + JSON.stringify(ts));

    //  console.log('seedArr= ' + seedArr);
    //  console.log('orderArr= ' + orderArr);
    //   console.log('coupledArr= ' + coupledArr);
      res.render("gbrackets/vw_tnt_make", {sdata:ts,tntid:tntid});
      });
});

// router.post("/test/makebarcket", isLoggedIn, function(req,res){
  router.post("/test/makebarcket", function(req,res){
  try {
  var jsondata = JSON.parse(req.body.tdata);
  //console.log('라우터'+req.body.tdata);
  mtnt_all.findOneAndUpdate({gameid: '9993-tnt-32-170710-테스트'},
    {tnt_all:jsondata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, tnt_alls) {
      if(error){
          console.log("Something wrong when updating data!");
      }
       var ts;
       ts = tnt_alls.tnt_all;
       tntid = tnt_alls.gameid;
        res.render("gbrackets/vw_tnt_make", {sdata:ts, tntid:tntid, user:req.user});
    });
  }
  catch(err) {
    //console.log('라우터data오류'+jsondata);
    // return res.redirect("tbrackets");
    return res.redirect("back");
  };
});


// router.post("/test/automake", isLoggedIn, function(req,res){
  router.post("/test/automake",function(req,res){
  var numGroup = req.body.noGroup;
  var numRank = req.body.noRank;
  var size_tnt;
  var no_power;
  var seedArr=[];
  var orderArr=[];
  var coupledArr=[];
  // console.log('numGroup =' +numGroup);
  // console.log('numRank =' +numRank);
  for (i=0; i<10; i++){
    if (numGroup*numRank > Math.pow(2, i) && numGroup*numRank <= Math.pow(2, i+1)){
       size_tnt = Math.pow(2, i+1);
       no_power = i+1;
    }
  }
  // console.log('Math.pow(2, 3) =' +Math.pow(2, 3));
  // console.log('size_tnt =' +size_tnt);
  // console.log('no_power =' +no_power);
  var seedArr = seeding(size_tnt);
  if(numGroup==1){
     orderArr = order_group1(numRank);
  }
  if(numGroup==2){
     orderArr = order_group2(numRank);
  }
  if(numGroup==3){
     orderArr = order_group3(numRank);
  }
  if(numGroup==4){
     orderArr = order_group4(numRank);
  }
  if(numGroup==5){
     orderArr = order_group5(numRank);
  }
  if(numGroup==6){
     orderArr = order_group6(numRank);
  }
  if(numGroup==7){
     orderArr = order_group7(numRank);
  }
  if(numGroup==8){
     orderArr = order_group8(numRank);
  }
  if(numGroup==16){
     orderArr = order_group16(numRank);
  }
  if(numGroup==32){
     orderArr = order_group32(numRank);
  }
  if(numGroup==64){
     orderArr = order_group64(numRank);
  }
  if(numGroup==128){
     orderArr = order_group128(numRank);
  }
  // console.log('orderArr=' +orderArr);
  var coupledArr = coupling(seedArr,orderArr);
  var preTeams = [];
  var preResults = [];
  // console.log('size_tnt/2 =' +size_tnt/2);
  preTeams = new Array(size_tnt/2);
  for (i=0; i<size_tnt/2; i++){
    preTeams[i] = new Array(2);
  }
  preResults[0] = new Array(1);
  for (i=0; i<no_power; i++){
    preResults[0][i] = new Array(Math.pow(2, no_power-(i+1)));
  }
  for (i=0; i<preResults[0][i].length; i++){
    preResults[0][i] = new Array(2);
  }
  for (i=0; i<no_power; i++){
      for (j=0; j<preResults[0][i].length; j++){
        preResults[0][i][j] = new Array(2);
      }
  }

  for (i=0; i<size_tnt/2; i++){
    preTeams[i][0]=coupledArr[2*i];
    preTeams[i][1]=coupledArr[2*i+1];
  }

  var entry = {
    teams : preTeams,
    results :preResults
  }


  mtnt_all.findOneAndUpdate({gameid: '9993-tnt-32-170710-테스트'},
    {tnt_all:entry},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, tnt_alls) {
      if(error){
          console.log("Something wrong when updating data!");
      }
       var ts;
       ts = tnt_alls.tnt_all;
       tntid = tnt_alls.gameid;
        res.render("gbrackets/vw_tnt_make", {sdata:ts, tntid:tntid, user:req.user});
    });

}); // 라우터


// #####################자동완성################
// router.post('/autofill', isLoggedIn, function(req,res){
  router.post('/test/autofill/:id',function(req,res){
  var pListi = [];
  var sorted_namelistarr = [];
  rbsm.find({ $or:[
    {'matchid':'1001-rb-tm-170716-1조'},
    {'matchid':'1002-rb-tm-170716-2조'}
    ]},
    {_id:0, rbsmplist:1}, function(err, results){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "matchid";
    results.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });
    sorted_namelistarr.push(sortbyrank(results[0].rbsmplist));
    sorted_namelistarr.push(sortbyrank(results[1].rbsmplist));
    var strarr = req.params.id.split('-');
    gamename = strarr[4]
    tntid = req.params.id ;

    if(req.body.highlow =='상위부'){
    var numGroup = req.body.noGroup;
    var numRank = req.body.noRankhigh;
    var size_tnt;
    var no_power;
    var seedArr=[];
    var orderArr=[];
    var coupledArr=[];
    for (i=0; i<10; i++){
      if (numGroup*numRank > Math.pow(2, i) && numGroup*numRank <= Math.pow(2, i+1)){
         size_tnt = Math.pow(2, i+1);
         no_power = i+1;
      }
    }

    var seedArr = seeding(size_tnt);
    if(numGroup==1){
       orderArr = seedArr;
    }
    if(numGroup==2){
       orderArr = order_group2(numRank);
    }
    if(numGroup==3){
       orderArr = order_group3(numRank);
    }
    if(numGroup==4){
       orderArr = order_group4(numRank);
    }
    if(numGroup==5){
       orderArr = order_group5(numRank);
    }
    if(numGroup==6){
       orderArr = order_group6(numRank);
    }
    if(numGroup==7){
       orderArr = order_group7(numRank);
    }
    if(numGroup==8){
       orderArr = order_group8(numRank);
    }
    var coupledArr = coupling(seedArr,orderArr);
    var preTeams = [];
    var preResults = [];
    preTeams = new Array(size_tnt/2);
    for (i=0; i<size_tnt/2; i++){
      preTeams[i] = new Array(2);
    }
    preResults[0] = new Array(1);
    for (i=0; i<no_power; i++){
      preResults[0][i] = new Array(Math.pow(2, no_power-(i+1)));
    }
    for (i=0; i<preResults[0][i].length; i++){
      preResults[0][i] = new Array(2);
    }
    for (i=0; i<no_power; i++){
        for (j=0; j<preResults[0][i].length; j++){
          preResults[0][i][j] = new Array(2);
        }
    }
    var playerArr = [];
    for (i=0; i<size_tnt; i++){
      if(coupledArr[i]){
      strarr=coupledArr[i].split('-');
      playerArr[i]=sorted_namelistarr[strarr[0]-1][strarr[1]-1];
      }
    }

    for (i=0; i<size_tnt/2; i++){
      preTeams[i][0]=playerArr[2*i];
      preTeams[i][1]=playerArr[2*i+1];
    }

    var entry = {
      teams : preTeams,
      results :preResults
    }


    mtnt_all.findOneAndUpdate({gameid: '9993-tnt-32-170710-테스트'},
      {tnt_all:entry},
      {new: true, upsert: true, setDefaultsOnInsert: true},
      function(error, tnt_alls) {
        if(error){
            console.log("Something wrong when updating data!");
        }
         var ts;
         ts = tnt_alls.tnt_all;
         var strarr = req.params.id.split('-');
         gamename = strarr[4]
         tntid = req.params.id ;
          res.render("gbrackets/vw_tnt_make", {sdata:ts,gamename:gamename, tntid:tntid, user:req.user});
      });
  }


  if(req.body.highlow =='하위부'){
  var numGroup = req.body.noGroup;
  var numRank = req.body.noRanklow;
  var numhigh = req.body.noRankhigh;
  var size_tnt;
  var no_power;
  var seedArr=[];
  var orderArr=[];
  var coupledArr=[];
  for (i=0; i<10; i++){
    if (numGroup*numRank > Math.pow(2, i) && numGroup*numRank <= Math.pow(2, i+1)){
       size_tnt = Math.pow(2, i+1);
       no_power = i+1;
    }
  }

  var seedArr = seeding(size_tnt);
  if(numGroup==1){
     orderArr = seedArr;
  }
  if(numGroup==2){
     orderArr = order_group2(numRank);
  }
  if(numGroup==3){
     orderArr = order_group3(numRank);
  }
  if(numGroup==4){
     orderArr = order_group4(numRank);
  }
  if(numGroup==5){
     orderArr = order_group5(numRank);
  }
  if(numGroup==6){
     orderArr = order_group6(numRank);
  }
  if(numGroup==7){
     orderArr = order_group7(numRank);
  }
  if(numGroup==8){
     orderArr = order_group8(numRank);
  }
  var coupledArr = coupling(seedArr,orderArr);
  var preTeams = [];
  var preResults = [];
  preTeams = new Array(size_tnt/2);
  for (i=0; i<size_tnt/2; i++){
    preTeams[i] = new Array(2);
  }
  preResults[0] = new Array(1);
  for (i=0; i<no_power; i++){
    preResults[0][i] = new Array(Math.pow(2, no_power-(i+1)));
  }
  for (i=0; i<preResults[0][i].length; i++){
    preResults[0][i] = new Array(2);
  }
  for (i=0; i<no_power; i++){
      for (j=0; j<preResults[0][i].length; j++){
        preResults[0][i][j] = new Array(2);
      }
  }
  var playerArr = [];
  for (i=0; i<size_tnt; i++){
    if(coupledArr[i]){
    strarr=coupledArr[i].split('-');
    playerArr[i]=sorted_namelistarr[Number(strarr[0])-1][Number(strarr[1])+(numhigh-1)];
    }
  }

  for (i=0; i<size_tnt/2; i++){
    preTeams[i][0]=playerArr[2*i];
    preTeams[i][1]=playerArr[2*i+1];
  }

  var entry = {
    teams : preTeams,
    results :preResults
  }


  mtnt_all.findOneAndUpdate({gameid: '9993-tnt-32-170710-테스트'},
    {tnt_all:entry},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, tnt_alls) {
      if(error){
          console.log("Something wrong when updating data!");
      }
       var ts;
       ts = tnt_alls.tnt_all;
       var strarr = req.params.id.split('-');
       gamename = strarr[4]
       tntid = req.params.id ;
        res.render("gbrackets/vw_tnt_make", {sdata:ts,gamename:gamename, tntid:tntid, user:req.user});
    });
}
    });


}); // 라우터


router.get("/view", isLoggedIn, function(req, res){
  tntbrkt_low16ff.find({}, {_id:0, tnt_l16:1}, function(err, tntbrkt_low16ffs){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
    ts = tntbrkt_low16ffs[0].tnt_l16;
     var jts = json.stringify(ts);
    res.render("gbrackets/vw_tnt_all", {sdata:ts, user:req.user});
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
  var rounds = Math.log(numPlayers)/Math.log(2)-1;
  var pls = [1,2];
  for(var i=0;i<rounds;i++){
    pls = nextLayer(pls);
  }
  return pls;
  function nextLayer(pls){
    var out=[];
    var length = pls.length*2+1;
    pls.forEach(function(d){
      out.push(d);
      out.push(length-d);
    });
    return out;
  }
  }

function seedingtable(numPlayers){
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




// 1-1 을 대진표 순서에 맞추어 나열
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

function sortbyrank(parr){
 // var sarr = [];
 // for(i=0; i<sarr.length-1; i++){
 //   sarr[i] = new Array();
 // }
 parr.shift();
 var out=[];
 idx = parr.length+2;
 parr.sort(function (a1, a2) {
    return (a1[idx]<a2[idx]) ? -1 : ((a1[idx]>a2[idx]) ? 1 : 0);
  });
 for(i=0; i<parr.length; i++){
   out.push(parr[i][0]);
 }
 return out;
}


// 1-1 2-2모양 알고리즘 순서대로 만들기
function order_group1(numRank){
    var out1 =[];
      for(j=0; j<numRank; j++){
          out1.push('1'+'-'+(j+1));
        }
    return out1;
}

function order_group2(numRank){
    var out=[];
    for(i=0; i<numRank; i++){
     for(j=0; j<2; j++){
       out.push((j+1)+'-'+(i+1));
     }
    }
    return out;
}


// 1-1 2-2모양 알고리즘 순서대로 만들기
  function order_group3(numRank){
      var out=[];
      if(numRank==1){
        for(i=0; i<3; i++){
          out.push((i+1)+'-1');
        }
      }
      if(numRank==2){
        out = ['1-1','2-1','3-1','3-2','2-2','1-2'];
      }
      if(numRank==3){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','1-3','3-3','2-3'];
      }
      if(numRank==4){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','1-3','3-3','2-3','3-4','2-4','1-4'];
      }
      if(numRank==5){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','1-3','3-3','2-3','3-4','2-4','1-4','3-5','2-5','1-5'];
      }
      if(numRank==6){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','3-3','1-3','2-3','1-4','3-4','2-4','1-5','3-5','2-5','3-6','2-6','1-6'];
      }
      if(numRank==7){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','3-3','1-3','2-3','1-4','2-4','1-5','3-4','3-5','2-5',
               '3-6','2-6','1-6','1-7','2-7','3-7'];
      }
      if(numRank==8){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','3-3','1-3','2-3','1-4','2-4','1-5','3-4','3-5','2-5',
               '3-6','2-6','1-6','1-7','2-7','3-7','3-8','2-8','1-8'];
      }
      if(numRank==9){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','3-3','1-3','2-3','1-4','2-4','1-5','3-4','3-5','2-5',
               '3-6','2-6','1-6','1-7','2-7','3-7','3-8','2-8','1-8','3-9','1-9','2-9'];
      }
      if(numRank==10){
        out = ['1-1','2-1','3-1','2-2','3-2','1-2','3-3','1-3','2-3','1-4','2-4','3-4','2-5','3-5','1-5','3-6','1-6','2-6',
               '1-7','2-7','3-7','2-8','3-8','1-8','3-9','1-9','2-9','1-10','2-10','3-10'];
      }
      return out;
  }

  function order_group4(numRank){
    var out=[];
      if(numRank==1){
        for(i=0; i<4; i++){
          out.push((i+1)+'-1');
        }
      }
      if(numRank==2){
        out = ['1-1','2-1','3-1','4-1','3-2','4-2','1-2','2-2'];
      }
      if(numRank==3){
        out = ['1-1','2-1','3-1','4-1','3-2','4-2','1-2','2-2','3-3','4-3','1-3','2-3'];
      }
      if(numRank==4){
        out = ['1-1','2-1','3-1','4-1','1-2','2-2','3-2','4-2','3-3','4-3','1-3','2-3','3-4','4-4','1-4','2-4'];
      }
      if(numRank==5){
        out = ['1-1','2-1','3-1','4-1','1-2','2-2','3-2','4-2','1-3','2-3','3-3','4-3','3-4','4-4','1-4','2-4',
               '3-5','4-5','1-5','2-5'];
      }
      if(numRank==6){
        out = ['1-1','2-1','3-1','4-1','1-2','2-2','3-2','4-2','1-3','2-3','3-3','4-3','3-4','4-4','1-4','2-4',
               '3-5','4-5','1-5','2-5','3-6','4-6','1-6','2-6'];
      }
      if(numRank==7){
        out = ['1-1','2-1','3-1','4-1','3-2','4-2','1-2','2-2','1-3','4-3','3-3','2-3','3-4','4-4','1-4','2-4',
               '3-5','2-5','1-5','4-5','1-6','2-6','3-6','4-6','3-7','2-7','1-7','4-7'];
      }
      if(numRank==8){
        out = ['1-1','4-1','3-1','2-1','3-2','4-2','1-2','2-2','3-3','4-3','1-3','2-3','3-4','4-4','1-4','2-4',
               '3-5','2-5','1-5','1-5','4-5','1-6','2-6','3-6','4-6','1-7','2-7','3-7','4-7','1-8','2-8','3-8','4-8'];
      }
      if(numRank==9){
        out = [];
      }
      if(numRank==10){
        out = [];
      }
      return out;
  }

  function order_group5(numRank){
    var out=[];
    if(numRank==1){
      for(i=0; i<5; i++){
        out.push((i+1)+'-1');
      }
    }
      if(numRank==2){
        out = ['1-1','2-1','3-1','4-1','5-1','4-2','5-2','3-2','2-2','1-2'];
      }
      if(numRank==3){
        out = ['1-1','2-1','3-1','4-1','5-1','1-2','5-2','4-2','2-2','3-2','2-3','3-3','1-3','5-3','4-3'];
      }
      if(numRank==4){
        out = ['1-1','2-1','3-1','4-1','5-1','4-2','1-2','5-2','2-2','3-2','2-3','3-3','1-3','5-3','4-3',
               '4-4','3-4','5-4','1-4','2-4'];
      }
      if(numRank==5){
        out = ['1-1','2-1','3-1','4-1','5-1','5-2','4-2','1-2','2-2','3-2','2-3','3-3','4-3','5-3','1-3',
               '5-4','3-4','4-4','1-4','2-4','1-5','4-5','2-5','3-5','5-5'];
      }
      if(numRank==6){
        out = ['1-1','2-1','3-1','4-1','5-1','1-2','2-2','4-2','5-2','3-2','3-3','4-3','2-3','5-3','1-3',
               '5-4','3-4','4-4','2-4','1-4','3-5','4-5','5-5','1-5','2-5','3-6','2-6','1-6','5-6','4-6'];
      }
      if(numRank==7){
        out = [];
      }
      if(numRank==8){
        out = [];
      }
      if(numRank==9){
        out = [];
      }
      if(numRank==10){
        out = [];
      }
      return out;
  }

  function order_group6(numRank){
    var out=[];
    if(numRank==1){
      for(i=0; i<6; i++){
        out.push((i+1)+'-1');
      }
    }
      if(numRank==2){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','5-2','6-2','2-2','1-2','4-2','3-2'];
      }
      if(numRank==3){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','1-2','2-2','3-2','4-2','5-2','6-2','1-3','2-3','3-3','4-3','5-3','6-3'];
      }
      if(numRank==4){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','1-2','2-2','3-2','4-2','5-2','6-2','1-3','2-3','3-3','4-3','5-3','6-3',
               '1-4','2-2','3-4','4-4','5-4','6-4'];
      }
      if(numRank==5){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','1-2','2-2','3-2','4-2','5-2','6-2','1-3','2-3','3-3','4-3','5-3','6-3',
               '1-4','2-4','3-4','4-4','5-4','6-4','1-5','2-5','3-5','4-5','5-5','6-5'];
      }
      if(numRank==6){
        out = [];
      }
      if(numRank==7){
        out = [];
      }
      if(numRank==8){
        out = [];
      }
      if(numRank==9){
        out = [];
      }
      if(numRank==10){
        out = [];
      }
      return out;
  }


  function order_group7(numRank){
    var out=[];
    if(numRank==1){
      for(i=0; i<7; i++){
        out.push((i+1)+'-1');
      }
    }
      if(numRank==2){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','7-1','7-2','2-2','1-2','5-2','6-2','3-2','4-2'];
      }
      if(numRank==3){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','7-1','2-2','3-2','4-2','5-2','6-2','7-2','1-2',
               '3-3','4-3','5-3','6-3','7-3','1-3','2-3'];
      }
      if(numRank==4){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','7-1','2-2','3-2','4-2','5-2','6-2','7-2','1-2',
               '3-3','4-3','5-3','6-3','7-3','1-3','2-3','4-4','5-4','6-4','7-4','1-4','2-4','3-4'];
      }
      if(numRank==5){
        out = [];
      }
      if(numRank==6){
        out = [];
      }
      if(numRank==7){
        out = [];
      }
      if(numRank==8){
        out = [];
      }
      if(numRank==9){
        out = [];
      }
      if(numRank==10){
        out = [];
      }
      return out;
  }


  function order_group8(numRank){
    var out=[];
    if(numRank==1){
      for(i=0; i<8; i++){
        out.push((i+1)+'-1');
      }
    }
      if(numRank==2){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','7-1','8-1','7-2','8-2','5-2','6-2','3-2','4-2','1-2','2-2'];
      }
      if(numRank==3){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','7-1','8-1','3-2','4-2','5-2','6-2','7-2','8-2','1-2','2-2',
               '5-3','6-3','7-3','8-3','1-3','2-3','3-3','4-3'];
      }
      if(numRank==4){
        out = ['1-1','2-1','3-1','4-1','5-1','6-1','7-1','8-1','3-2','4-2','5-2','6-2','7-2','8-2','1-2','2-2',
               '5-3','6-3','7-3','8-3','1-3','2-3','3-3','4-3','7-4','8-4','1-4','2-4','3-4','4-4','5-4','6-4'];
      }
      if(numRank==5){
        out = [];
      }
      if(numRank==6){
        out = [];
      }
      if(numRank==7){
        out = [];
      }
      if(numRank==8){
        out = [];
      }
      if(numRank==9){
        out = [];
      }
      if(numRank==10){
        out = [];
      }
      return out;
  }

  function order_group16(numRank){
    var out=[];
    if(numRank==1){
      for(i=0; i<16; i++){
        out.push((i+1)+'-1');
      }
    }
    return out;
    }
    function order_group32(numRank){
      var out=[];
      if(numRank==1){
        for(i=0; i<32; i++){
          out.push((i+1)+'-1');
        }
      }
      return out;
      }
      function order_group64(numRank){
        var out=[];
        if(numRank==1){
          for(i=0; i<64; i++){
            out.push((i+1)+'-1');
          }
        }
        return out;
        }

        function order_group128(numRank){
          var out=[];
          if(numRank==1){
            for(i=0; i<128; i++){
              out.push((i+1)+'-1');
            }
          }
          return out;
      }
  function order_group9(numRank){
    var out=[];
      // var out=[];
      if(numRank=2){
        out = [];
      }
      if(numRank=3){
        out = [];
      }
      if(numRank=4){
        out = [];
      }
      if(numRank=5){
        out = [];
      }
      if(numRank=6){
        out = [];
      }
      if(numRank=7){
        out = [];
      }
      if(numRank=8){
        out = [];
      }
      if(numRank=9){
        out = [];
      }
      if(numRank=10){
        out = [];
      }
      return out;
  }


  function order_group10(numRank){
    var out=[];
      // var out=[];
      if(numRank=2){
        out = [];
      }
      if(numRank=3){
        out = [];
      }
      if(numRank=4){
        out = [];
      }
      if(numRank=5){
        out = [];
      }
      if(numRank=6){
        out = [];
      }
      if(numRank=7){
        out = [];
      }
      if(numRank=8){
        out = [];
      }
      if(numRank=9){
        out = [];
      }
      if(numRank=10){
        out = [];
      }
      return out;
  }
module.exports = router;

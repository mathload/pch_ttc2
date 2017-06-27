var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
//var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var async  = require('async');
var util     = require("../../util");
//var ResultSet     = require('../../models/md_resultSet');
// var pList = require('../../models/md_rbPlayer');
var rbsm = require('../../models/md_sm_rb');
// Home
router.get("/:id", function(req, res){
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  var gname_type = strArr[0];
  var gname_id = Number(strArr[1]);
  var pListi = [];

//   var initSet = new pList({
//     rblid : 10,
//     rbplist: ['홍길동']
//   });
//
// initSet.save(function(err, ResultSet){
//     if(err) return console.error(err);
// });

  rbsm.find({rbsmid : gname_id}, {_id:0, rbsmplist:1}, function(err, pLists){
    if(err) return res.status(500).send({error: 'database find failure'});
    pListi = pLists[0].rbsmplist;
    //var arr = ['가','나'];
    //console.log('pListi='+pListi);
    //console.log('arr='+arr);
    var hcol = [];
    var hlow = [];
    var count;
    var group_name1 = ['A조','B조','C조','D조','E조','F조'];
    var gname;
    var group_name2 = ['1그룹','2그룹','3그룹','4그룹','5그룹','6그룹','7그룹','8그룹'];
    var g_id = gname_id%10;
    // console.log("gname_type=" + gname_type);
      if(gname_type == 'rbsm'){
        for ( var sn = 0 ; sn < 6 ; sn++ ){
            if(g_id == sn){
              gname = group_name1[sn]
            };
        };
     };
    if(gname_type == 'ts' || gname_type == 'td'){
        for ( var sn = 0 ; sn < 8 ; sn++ ){
            if(g_id == sn){
              gname = group_name2[sn]
            };
       };
    };
    count = pListi.length;
    hlow[0]='';
    for(var i=0; i<count; i++) {
      hlow[i+1]=i+1;
      hcol[i] = '';
    };
    //colh[count-1] =  '';
    hcol[count] = '승패';
    hcol[count+1] = '순위';
    res.render("htable/rb_each", {pList:pListi,  gname:gname, gameID:gameID,hlow:hlow,hcol:hcol});
});
});

router.post('/:id', function(req, res){

  async.waterfall([
  function(callback){
    var nameq = req.body.playerName;
    var gameID = req.params.id;
    var strArr = gameID.split('-');
    var gname_id = Number(strArr[1]);
    console.log('nameq='+nameq);
    console.log('gname_id='+gname_id);

          var hcol = [];
          var hlow = [];
          var count;
          rbsm.find({rbsmid : gname_id}, {_id:0, rbsmplist:1}, function(err, pLists){
            if(err) return res.status(500).send({error: 'database find failure'});
            pListi = pLists[0].rbsmplist;
            //pListi.push(nameq);
            count = pListi.length;
            var prelist = new Array(count+1);
            for(var i=0; i<count+1; i++) {
              prelist[i] = new Array(count+3);
            }; // end for
            for(var i=0; i<count; i++) {
              for(var j=0; j<count; j++) {
                 prelist[i][j]=pListi[i][j];
              };
            };
            prelist[0][count] = nameq;
            prelist[count][0] = nameq;
            prelist[count][count] = '*';
            hlow[0]='';
            for(var i=0; i<count; i++) {
              hlow[i+1]=i+1;
              hcol[i] = '';
            };
            hcol[count] =  '';
            hcol[count+1] = '승패';
            hcol[count+2] = '순위';
            callback(null, prelist, hcol, hlow, gameID);
          });
    //callback(null, pListi,gameID);
  },
  function(pListi, hcol, hlow, gameID, callback){
            var pListr = [];
            var strArr = gameID.split('-');
            var gname_id = Number(strArr[1]);
            //console.log('pListi='+pListi) // 'one'
            rbsm.findOneAndUpdate({rbsmid : gname_id},
              {rbsmplist:pListi},
              {new: true, upsert: true, setDefaultsOnInsert: true},
              function(error, pLists) {
                if(error){
                    console.log("Something wrong when updating data!");
                }

                pListr = pLists.rbsmplist;
                callback(null, pListr, hcol, hlow, gameID);
            });
    //callback(null, pListr,gameID);
  },
  function(pListr, hcol, hlow, gameID, callback){
        var strArr = gameID.split('-');
        var gname_type = strArr[0];
        var gname_id = Number(strArr[1]);
        var group_name1 = ['A조','B조','C조','D조','E조','F조'];
        var gname;
        var group_name2 = ['1그룹','2그룹','3그룹','4그룹','5그룹','6그룹','7그룹','8그룹'];
        var g_id = gname_id%10;
        // console.log("gname_type=" + gname_type);
          if(gname_type == 'rbsm'){
            for ( var sn = 0 ; sn < 6 ; sn++ ){
                if(g_id == sn){
                  gname = group_name1[sn]
                };
            };
         };
        if(gname_type == 'ts' || gname_type == 'td'){
            for ( var sn = 0 ; sn < 8 ; sn++ ){
                if(g_id == sn){
                  gname = group_name2[sn]
                };
           };
        };
      //  console.log('pListr='+pListr);
        res.render("htable/rb_each", {pList:pListr,  gname:gname, gameID:gameID,hcol:hcol, hlow:hlow});
    callback(null, '끝');
  }
], function (err, result) {
   // result에는 '끝'이 담겨 온다.
});


});

router.get("/about", function(req, res){
  res.render("gbooks/index");
});

router.post("/savedata/:id", function(req, res){
  // var rdata = JSON.parse(req.body.savedata);
  var rdata = req.body.savedata;
  // var rdata = JSON.stringify(req.body.savedata, undefined, 2);
  var tdata =[["","가나다",null]];
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  var gname_id = Number(strArr[1]);
  rdata = rdata.replace(/"/g, "");
    //  console.log('rdata='+rdata);
  var dataArr = rdata.split(']');
  var no = dataArr.length;
  var fdata = [];
  for(k = 0; k < no-2; k++){
    fdata.push(dataArr[k].substring(2));
  }
  var count = fdata.length;
  var finaldata=[];
  // finaldata[0] = new Array();
  // for(i = 0; i < count; i++){
  //   var cutarray = fdata[i].split(',');
  //   var jc = cutarray.length;
  //      for(j = 0; j < jc; j++){
  //        finaldata[0][jc]=cutarray[jc];
  //      }
  //
  // }
  for(i = 0; i < count; i++){
    var cutarray = fdata[i].split(',');
    finaldata[i] = cutarray;
  }

  // for(i = 0; i < count; i++){
  //   finaldata[i]= finaldata[i].replace (/"/g,'');
  // }
  //  console.log('rdata='+fdata[0]);
  //  console.log('finaldata='+finaldata[0]);
  // console.log('rdata='+fdata[5]);
  // console.log('fdata.length='+fdata.length);

  //   var initSet = new rbsm({
  //     rbsmid : 21,
  //     // rbsmplist: [["",null,null]]
  //     rbsmplist: finaldata
  //   });
  //
  // initSet.save(function(err, rbsmplists){
  //     if(err) return console.error(err);
  // });

  rbsm.findOneAndUpdate({rbsmid : gname_id},
    {rbsmplist:finaldata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, gbkt_eachs) {
      if(error){
          console.log("Something wrong when updating data!");
      }
    res.redirect('back');
});
});
// Login
router.get('/login', function (req,res) {
  res.render('login/login',{username:req.flash("username")[0], loginError:req.flash('loginError'), loginMessage:req.flash('loginMessage')});
});


// Logout
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("postsMessage", "Good-bye, have a nice day!");
    res.redirect('/');
});

module.exports = router;

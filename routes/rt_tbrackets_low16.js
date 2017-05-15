var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var mtnt_low16 = require('../models/tntbrkt_low16');
var md_gRank = require('../models/md_groupRank');
var mtnt_high = require('../models/tntbrkt_high32');



router.get("/", isLoggedIn, function(req, res){
  mtnt_low16.find({}, {_id:0, tnt_l16:1}, function(err, mtnt_low16s){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
    //ts = mtnt_low16s[0].tnt_l16;
    ts = mtnt_low16s[0].tnt_l16;
    res.render("gbrackets/vw_tnt_low16", {sdata:ts, user:req.user});
    });
});


router.post('/', isLoggedIn, function(req,res){
  var jsondata = JSON.parse(req.body.tdata);
  var data = new mtnt_low16;
  data.gid = 32;
  data.tnt_l16 = jsondata;
  mtnt_low16.findOneAndUpdate({gid: data.gid},
    {tnt_l16:jsondata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, mtnt_low16s) {
      if(error){
          console.log("Something wrong when updating data!");
      }
       var ts;
       ts = mtnt_low16s.tnt_l16;
       res.render("gbrackets/vw_tnt_low16", {sdata:ts, user:req.user});
    });
});

router.post('/uinput', isLoggedIn, function(req,res){
   var a1= "1조5위";
   var a2= "1조6위";
   var a3= "1조7위";
   var a4= "1조8위";
   var b1= "2조5위";
   var b2= "2조6위";
   var b3= "2조7위";
   var b4= "2조8위";
   var c1= "3조5위";
   var c2= "3조6위";
   var c3= "3조7위";
   var c4= "3조8위";
   var d1= "4조5위";
   var d2= "4조6위";
   var d3= "4조7위";
   var d4= "4조8위";
   var e1= "5조5위";
   var e2= "5조6위";
   var e3= "5조7위";
   var e4= "5조8위";
   var bye;
   var rdata_A;
   var rdata_B;
   var rdata_C;
   var rdata_D;
   var rdata_E;
   var rdata_F;
   var ts = [];
   var nameArrA = [];
   var nameArrB = [];
   var nameArrC = [];
   var nameArrD = [];
   var nameArrE = [];
   var nameArrF = [];
   var aN = [];
   var bN = [];
   var cN = [];
   var dN = [];
   var eN = [];
   var fN = [];
   md_gRank.find({rid: { $gt: 69, $lt: 79 }}, {_id:0, group_rank:1}, function(err, md_gRanks){
     if(err) return res.status(500).send({error: 'database find failure'});
     ts[0] = md_gRanks[0].group_rank;
     ts[1] = md_gRanks[1].group_rank;
     ts[2] = md_gRanks[2].group_rank;
     ts[3] = md_gRanks[3].group_rank;
     ts[4] = md_gRanks[4].group_rank;
     ts[5] = md_gRanks[5].group_rank;

     for ( var ku = 0 ; ku < 6 ; ku++ ){
       if(ts[ku].gName == 10){
         rdata_A = ts[ku];
       }
       if(ts[ku].gName == 11){
         rdata_B = ts[ku];
       }
       if(ts[ku].gName == 12){
         rdata_C = ts[ku];
       }
       if(ts[ku].gName == 13){
         rdata_D = ts[ku];
       }
       if(ts[ku].gName == 14){
         rdata_E = ts[ku];
       }
       if(ts[ku].gName == 15){
         rdata_F = ts[ku];
       }
  }; // end of for ku

   for ( var ia = 0 ; ia < rdata_A.gnamePlus.length ; ia++ ){
     var snA = rdata_A.gnamePlus[ia].split('-');
     nameArrA[ia] = snA[2];
   };

   for ( var i = 0 ; i < rdata_A.rankData.length ; i++ ){
     var ndA = rdata_A.rankData[i]%100
     aN[i] = nameArrA[ndA];
   };

   for ( var ia = 0 ; ia < rdata_B.gnamePlus.length ; ia++ ){
     var snB = rdata_B.gnamePlus[ia].split('-');
     nameArrB[ia] = snB[2];
   };

   for ( var i = 0 ; i < rdata_B.rankData.length ; i++ ){
     var ndB = rdata_B.rankData[i]%100
     bN[i] = nameArrB[ndB];
   };

   for ( var ia = 0 ; ia < rdata_C.gnamePlus.length ; ia++ ){
     var snC = rdata_C.gnamePlus[ia].split('-');
     nameArrC[ia] = snC[2];
   };

   for ( var i = 0 ; i < rdata_C.rankData.length ; i++ ){
     var ndC = rdata_C.rankData[i]%100
     cN[i] = nameArrC[ndC];
   };

   for ( var ia = 0 ; ia < rdata_D.gnamePlus.length ; ia++ ){
     var snD = rdata_D.gnamePlus[ia].split('-');
     nameArrD[ia] = snD[2];
   };

   for ( var i = 0 ; i < rdata_D.rankData.length ; i++ ){
     var ndD = rdata_D.rankData[i]%100
     dN[i] = nameArrD[ndD];
   };


   for ( var ia = 0 ; ia < rdata_E.gnamePlus.length ; ia++ ){
     var snE = rdata_E.gnamePlus[ia].split('-');
     nameArrE[ia] = snE[2];
   };

   for ( var i = 0 ; i < rdata_E.rankData.length ; i++ ){
     var ndE = rdata_E.rankData[i]%100
     eN[i] = nameArrE[ndE];
   };

   var a1= aN[4];
   var a2= aN[5];
   var a3= aN[6];
   //var a4= aN[7];
   var b1= bN[4];
   var b2= bN[5];
   var b3= bN[6];
  // var b4= bN[7];
   var c1= cN[4];
   var c2= cN[5];
   var c3= cN[6];
  // var c4= cN[7];
   var d1= dN[4];
   var d2= dN[5];
   var d3= dN[6];
  // var d4= dN[7];
   var e1= eN[4];
   var e2= eN[5];
   var e3= eN[6];
  // var e4= eN[7];

   var jsondata = JSON.parse(req.body.tdata);
   var t32_even = [a1,b2,e1,a3,c1,b3,e2,d3];
   var t32_odd = [bye,d2,c3,d1,e3,a2,c2,b1];
   for ( var k1 = 0 ; k1 < 8 ; k1++ ){
      jsondata.teams[k1][0] =t32_even[k1];
      jsondata.teams[k1][1] =t32_odd[k1];
   };

  var data2 = new mtnt_low16;
  data2.gid = 32
  data2.tnt_l16 = jsondata;
  mtnt_low16.findOneAndUpdate({gid: data2.gid},
    {tnt_l16:jsondata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, mtnt_low16s) {
      if(error){
          console.log("Something wrong when updating data!");
      }
       var ts;
       ts = mtnt_low16s.tnt_l16;
       res.render("gbrackets/vw_tnt_low16", {sdata:ts, user:req.user});
    });
}); // end of find
});  // end of router

router.get("/view", isLoggedIn, function(req, res){
  mtnt_low16.find({}, {_id:0, tnt_l16:1}, function(err, mtnt_low16s){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
    ts = mtnt_low16s[0].tnt_l16;
     var jts = json.stringify(ts);
    res.render("gbrackets/vw_tnt_low16", {sdata:ts, user:req.user});
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("gbooksMessage","Please login first.");
  res.redirect('/gbooks');
}

module.exports = router;

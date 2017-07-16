var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var md_gRank = require('../models/md_groupRank');
var rbsm = require('../models/md_sm_rb');
// Home
router.get("/", function(req, res){
  md_gRank.find({rid : 70}, {_id:0, group_rank:1}, function(err, md_gRanks){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
    ts = md_gRanks[0].group_rank;
     //var jts = json.stringify(ts);
    res.render("gbrackets/vw_single_rank", {data_A:ts, tid:70});
    });
});


router.get("/teamtotal", function(req, res){
  var pListi = [];
  rbsm.find({ $or:[
    // {'matchid':'2001-rb-sm-170618-1조'},
    // {'matchid':'2002-rb-sm-170618-2조'},
    {'matchid':'9990-rb-tmsingle-170628-test'},
    {'matchid':'9991-rb-tmdouble-170628-test'}
    ]},
    {_id:0, rbsmplist:1, matchid:1}, function(err, results){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "matchid";
    results.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });
    // console.log(' results=' +results[1] );
    // console.log('results.length =' +results.length );

    for(i=0; i<results.length; i++){
          pListi[i] = results[i].rbsmplist;
    }
    var teamno = pListi[0].length-1;
    no_single = 1;
    no_double = 1;
    var totalPoint = [];
    var winPoint = [];
    var rankArr = [];
    var totalArr = [];
    for(i=0; i<teamno; i++){
        totalPoint[i] = 0;
        winPoint[i] = 0;
        rankArr[i] = new Array();
    }

    for(i=0; i<no_single; i++){
            var teamSize = pListi[0].length-1;
            var pName = [];
            var pPoint = [];
            for(i=0; i<teamSize; i++){
              pName[i] = new Array();
              pPoint[i] = new Array();
            }
            for(j=0; j<no_single; j++){
                for(i=0; i<teamSize; i++){
                      pName[j].push(pListi[j][i+1][0]);
                      pPoint[j].push( (teamSize+1)-(pListi[j][i+1][teamSize+2]));
                      totalPoint[i] = totalPoint[i]+ ((teamSize+1)-(pListi[j][i+1][teamSize+2]));
                      var arr = pListi[j][i+1][teamSize+1].split('(');
                      winPoint[i] = winPoint[i]+ Number(arr[0]);
                }
            }

    for(i=0; i<no_double; i++){
            var teamSize = pListi[no_single].length-1;
            var dName = [];
            var pdName = [];
            var dPoint = [];
            for(i=0; i<teamSize; i++){
              dName[i] = new Array();
              pdName[i] = new Array();
              dPoint[i] = new Array();
            }
            for(j=0; j<no_double; j++){
                for(i=0; i<teamSize; i++){
                      dName[j].push(pListi[no_single+j][i+1][0]);
                      dPoint[j].push(( (teamSize+1)-(pListi[no_single+j][i+1][teamSize+2]))*2);
                      totalPoint[i] = totalPoint[i]+ ((teamSize+1)-(pListi[no_single+j][i+1][teamSize+2]))*2;
                      pdName[j][i] = new Array();
                      var arr2 = pListi[no_single+j][i+1][teamSize+1].split('(');
                      winPoint[i] = winPoint[i]+ Number(arr2[0]);
                }
            }
              for(j=0; j<no_double; j++){
                  for(i=0; i<teamSize; i++){
                    var spArr = dName[j][i].split('-');
                       pdName[j][i].push(spArr[0]);
                       pdName[j][i].push(spArr[1]);
                }
              }
          }
      var totalArr = [];
      for(i=0; i<teamno; i++){
        totalArr[i] = totalPoint[i]*1000 + winPoint[i];
      }
    var arr = totalArr;
    var sorted = arr.slice().sort(function(a,b){return b-a})
    var ranks = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

    var shapes = [
    [4, "Trapezium"],
    [5, "Pentagon"],
    [3, "Triangle"],
    [4, "Rectangle"],
    [4, "Square"]
    ];


  };
  res.render("gbrackets/vw_team_total", {pName:pName, pPoint:pPoint,totalPoint:totalPoint,
                                         pdName:pdName, dPoint:dPoint, ranks:ranks});
  });

});


router.post('/tview/:id', function(req,res){
  var data = new md_gRank;
  var pram = req.body.rdata;
  var jsondata = JSON.parse(req.body.rdata);

  data.rid = 71
  data.group_rank = jsondata;
  md_gRank.findOneAndUpdate({rid: data.rid},
    {group_rank:jsondata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, md_gRanks) {
      if(error){
          console.log("Something wrong when updating data!");
      }
    });
});

router.get("/smview/", function(req, res){
  md_gRank.find({ rid: { $gt: 69, $lt: 80 }}, {_id:0, group_rank:1}, function(err, md_gRanks){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts0 = md_gRanks[0].group_rank;
    var ts1 = md_gRanks[1].group_rank;
    var ts2 = md_gRanks[2].group_rank;
    var ts3 = md_gRanks[3].group_rank;
    var ts4 = md_gRanks[4].group_rank;
    var ts5 = md_gRanks[5].group_rank;
    res.render("gbrackets/vw_single_rank", {data_0:ts0, data_1:ts1, data_2:ts2, data_3:ts3, data_4:ts4, data_5:ts5});
  });
});


router.get("/tmview/", function(req, res){
  md_gRank.find({ rid: { $gt: 79, $lt: 99 }}, {_id:0, group_rank:1}, function(err, md_gRanks){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts0 = md_gRanks[0].group_rank;
    var ts1 = md_gRanks[1].group_rank;
    var ts2 = md_gRanks[2].group_rank;
    var ts3 = md_gRanks[3].group_rank;
    var ts4 = md_gRanks[4].group_rank;
    var ts5 = md_gRanks[5].group_rank;
    var ts6 = md_gRanks[6].group_rank;
    var ts7 = md_gRanks[7].group_rank;
    var ts8 = md_gRanks[8].group_rank;
    var ts9 = md_gRanks[9].group_rank;
    var ts10 = md_gRanks[10].group_rank;
    var ts11 = md_gRanks[11].group_rank;
    var ts12 = md_gRanks[12].group_rank;
    res.render("gbrackets/vw_team_rank", {data_0:ts0, data_1:ts1, data_2:ts2, data_3:ts3, data_4:ts4,
                                      data_5:ts5, data_6:ts6, data_7:ts7, data_8:ts8, data_9:ts9,
                                      data_10:ts10, data_11:ts11, data_12:ts12});
  });
});

module.exports = router;

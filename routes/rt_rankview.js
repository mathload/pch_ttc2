var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var md_gRank = require('../models/md_groupRank');
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
       var ts;
       ts = md_gRanks.group_rank;
      // var jts = json.parse(ts);
      console.log(ts);
       // res.render("tbrackets/tnt_high", {sdata:ts});
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

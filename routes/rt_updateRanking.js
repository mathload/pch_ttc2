var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var async    = require('async');
var util     = require("../util");
var memberList = require('../models/md_memberList');
var listRanking = require('../models/md_listRanking');
var ResultSet = require('../models/md_resultSet');
var glicko2 = require('glicko2-lite');


router.get('/', function(req,res){
    var playerList = [];
    var rsets = [];

    ResultSet.find({}, {_id:0,}, function(err, ResultSets){
      if(err) return res.status(500).send({error: 'database find failure'});
      for ( var res1 = 0 ; res1 < ResultSets.length ; res1++ ){
          rsets.push(ResultSets[res1]);
      };

    var rst= -1;
    async.forEachLimit(rsets, 1, function(rset, userCallback){
      var my_id1;
      var your_id1;
      rst = rst+1

        async.waterfall([
            function(callback) {
              // to do code
              var playerList = [];
              memberList.find({}, {_id:0,}, function(err, memberLists){
                    if(err) return res.status(500).send({error: 'database find failure'});
                    for ( var pl = 0 ; pl < memberLists.length ; pl++ ){
                        playerList.push(memberLists[pl].myname);
                        };
                    callback(null, memberLists, playerList);
                  });
            },
            function(memberLists, playerList, callback) {
                // to do code
                for ( var pl2 = 0 ; pl2 < playerList.length ; pl2++ ){

                    if(rsets[rst].pName1 == memberLists[pl2].myname){
                      my_id1= pl2;
                      for ( var pl3 = 0 ; pl3 < playerList.length ; pl3++ ){
                        if(rsets[rst].pName2 == memberLists[pl3].myname){
                          your_id1=pl3;
                        }// end of if(ResultSets[rs].pName2
                      }// end of for ( var pl3

                        var upRanking = new memberList;
                        var lRanking = new listRanking;
                        upRanking.myname = memberLists[my_id1].myname;
                        upRanking.myBeforeRating = memberLists[my_id1].myCurrentRating;
                        upRanking.oppname = memberLists[your_id1].myname;
                        upRanking.currentDate = ResultSets[rst].gDate;
                        upRanking.myScore = ResultSets[rst].score1;
                        upRanking.oppScore = ResultSets[rst].score2;
                            if( ResultSets[rst].score1 > ResultSets[rst].score2){
                              upRanking.no_win = memberLists[my_id1].no_win+1;
                              upRanking.no_loss = memberLists[my_id1].no_loss;
                            } else if( ResultSets[rst].score1 < ResultSets[rst].score2){
                              upRanking.no_win = memberLists[my_id1].no_win;
                              upRanking.no_loss = memberLists[my_id1].no_loss+1;
                            } else {

                            };

                        upRanking.winRate = (upRanking.no_win)/(upRanking.no_win+upRanking.no_loss)*100
                        upRanking.oppBeforeRating = memberLists[your_id1].myCurrentRating;
                        var me = {
                          rating: memberLists[my_id1].myCurrentRating,
                          rd: memberLists[my_id1].rd,
                          vol: memberLists[my_id1].vol
                        };
                        var you = {
                          rating: memberLists[your_id1].myCurrentRating,
                          rd: memberLists[your_id1].rd,
                          vol: memberLists[your_id1].vol
                        };
                        var rset = ResultSets[rst].result;
                        myrating = glicko2(me.rating, me.rd, me.vol, [
                          [you.rating, you.rd, rset]
                        ], {tau: 0.5});
                        var rset2 = 1-rset;
                        yourrating = glicko2(you.rating, you.rd, you.vol, [
                          [me.rating, me.rd, rset2]
                        ], {tau: 0.5});

                        upRanking.myCurrentRating = myrating.rating;
                        upRanking.rd = myrating.rd;
                        upRanking.vol = myrating.vol;
                        upRanking.oppCurrentRating = yourrating.rating;

                        lRanking.myname =upRanking.myname;
                        lRanking.myCurrentRating =upRanking.myCurrentRating;
                        lRanking.myBeforeRating=upRanking.myBeforeRating;
                        lRanking.oppname=upRanking.oppname;
                        lRanking.currentDate=upRanking.currentDate;
                        lRanking.myScore=upRanking.myScore;
                        lRanking.oppScore=upRanking.oppScore;
                        lRanking.no_win = upRanking.no_win;
                        lRanking.no_loss = upRanking.no_loss;
                        lRanking.winRate=upRanking.winRate;
                        lRanking.oppBeforeRating=upRanking.oppBeforeRating;
                        lRanking.rd=upRanking.rd;
                        lRanking.vol=upRanking.vol;
                        lRanking.oppCurrentRating=upRanking.oppCurrentRating;
                        }; //   if resultSet pname1

                        }; //   for pl2
                callback(null, upRanking, lRanking);
            },
            function(upRanking, lRanking, callback) {
                memberList.findOneAndUpdate({myname: upRanking.myname},
                  {myCurrentRating :upRanking.myCurrentRating,
                    myBeforeRating:upRanking.myBeforeRating,
                    oppname:upRanking.oppname,
                    currentDate:upRanking.currentDate,
                    myScore:upRanking.myScore,
                    oppScore:upRanking.oppScore,
                    no_win : upRanking.no_win,
                    no_loss : upRanking.no_loss,
                    winRate:upRanking.winRate,
                    oppBeforeRating:upRanking.oppBeforeRating,
                    rd:upRanking.rd,
                    vol:upRanking.vol,
                    oppCurrentRating:upRanking.oppCurrentRating
                  },
                  {new: true, upsert: true, setDefaultsOnInsert: true},
                  function(error, upRankings) {
                    if(error){
                        console.log("Something wrong when updating data!");
                    }
                  });
                callback(null, lRanking);
            },
            function(lRanking, callback) {
                lRanking.save(function(err, lRankings){
                    if(err) return console.error(err);
                });
                callback(null, 'done');
            },

            function(second,callback) {
              // to do code
              var playerList = [];
              memberList.find({}, {_id:0,}, function(err, memberLists){
                    if(err) return res.status(500).send({error: 'database find failure'});
                    for ( var pl = 0 ; pl < memberLists.length ; pl++ ){
                        playerList.push(memberLists[pl].myname);
                        };
                    callback(null, memberLists, playerList);
                  });
            },
            function(memberLists, playerList, callback) {
                // to do code
                for ( var pl2 = 0 ; pl2 < playerList.length ; pl2++ ){
                        if(rsets[rst].pName2 == memberLists[pl2].myname){
                          my_id1= pl2;
                          for ( var pl3 = 0 ; pl3 < playerList.length ; pl3++ ){
                            if(rsets[rst].pName1 == memberLists[pl3].myname){
                              your_id1=pl3
                            }// end of if(ResultSets[rs].pName2
                          }// end of for ( var pl3

                            var upRanking = new memberList;
                            var lRanking = new listRanking;
                            upRanking.myname = memberLists[my_id1].myname;
                            upRanking.myBeforeRating = memberLists[my_id1].myCurrentRating;
                            upRanking.oppname = memberLists[your_id1].myname;
                            upRanking.currentDate = ResultSets[rst].gDate;
                            upRanking.myScore = ResultSets[rst].score2;
                            upRanking.oppScore = ResultSets[rst].score1;
                                if( ResultSets[rst].score2 > ResultSets[rst].score1){
                                  upRanking.no_win = memberLists[my_id1].no_win+1;
                                  upRanking.no_loss = memberLists[my_id1].no_loss;
                                } else if( ResultSets[rst].score2 < ResultSets[rst].score1){
                                  upRanking.no_win = memberLists[my_id1].no_win;
                                  upRanking.no_loss = memberLists[my_id1].no_loss+1;
                                } else {

                                };

                            upRanking.winRate = (upRanking.no_win)/(upRanking.no_win+upRanking.no_loss)*100
                            upRanking.oppBeforeRating = memberLists[your_id1].myCurrentRating;
                            var me = {
                              rating: memberLists[my_id1].myCurrentRating,
                              rd: memberLists[my_id1].rd,
                              vol: memberLists[my_id1].vol
                            };
                            var you = {
                              rating: memberLists[your_id1].myCurrentRating,
                              rd: memberLists[your_id1].rd,
                              vol: memberLists[your_id1].vol
                            };
                            var rset = ResultSets[rst].result;
                            var rset2 = 1-rset;
                            myrating = glicko2(me.rating, me.rd, me.vol, [
                              [you.rating, you.rd, rset2]
                            ], {tau: 0.5});
                            yourrating = glicko2(you.rating, you.rd, you.vol, [
                              [me.rating, me.rd, rset]
                            ], {tau: 0.5});

                            upRanking.myCurrentRating = myrating.rating;
                            upRanking.rd = myrating.rd;
                            upRanking.vol = myrating.vol;
                            upRanking.oppCurrentRating = yourrating.rating;

                            lRanking.myname =upRanking.myname;
                            lRanking.myCurrentRating =upRanking.myCurrentRating;
                            lRanking.myBeforeRating=upRanking.myBeforeRating;
                            lRanking.oppname=upRanking.oppname;
                            lRanking.currentDate=upRanking.currentDate;
                            lRanking.myScore=upRanking.myScore;
                            lRanking.oppScore=upRanking.oppScore;
                            lRanking.no_win = upRanking.no_win;
                            lRanking.no_loss = upRanking.no_loss;
                            lRanking.winRate=upRanking.winRate;
                            lRanking.oppBeforeRating=upRanking.oppBeforeRating;
                            lRanking.rd=upRanking.rd;
                            lRanking.vol=upRanking.vol;
                            lRanking.oppCurrentRating=upRanking.oppCurrentRating;

                            }; //   if resultSet pname2
                        }; //   for pl2
                callback(null, upRanking, lRanking);
            },
            function(upRanking, lRanking, callback) {
                memberList.findOneAndUpdate({myname: upRanking.myname},
                  {myCurrentRating :upRanking.myCurrentRating,
                    myBeforeRating:upRanking.myBeforeRating,
                    oppname:upRanking.oppname,
                    currentDate:upRanking.currentDate,
                    myScore:upRanking.myScore,
                    oppScore:upRanking.oppScore,
                    no_win : upRanking.no_win,
                    no_loss : upRanking.no_loss,
                    winRate:upRanking.winRate,
                    oppBeforeRating:upRanking.oppBeforeRating,
                    rd:upRanking.rd,
                    vol:upRanking.vol,
                    oppCurrentRating:upRanking.oppCurrentRating
                  },
                  {new: true, upsert: true, setDefaultsOnInsert: true},
                  function(error, upRankings) {
                    if(error){
                        console.log("Something wrong when updating data!");
                    }
                  });
                callback(null, lRanking);
            },
            function(lRanking, callback) {
                lRanking.save(function(err, lRankings){
                    if(err) return console.error(err);
                });
                callback(null, 'done');
            }
        ], function (err, result) {
            userCallback();
        });


    }, function(err){
    });
  }); //   ResultSet.find({},
res.redirect("/");
}); // end of router.get('/',



    module.exports = router;

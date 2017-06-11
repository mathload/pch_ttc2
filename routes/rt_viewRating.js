var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var async = require('async');
var listRanking = require('../models/md_listRanking');
var memberList = require('../models/md_memberList');
// Home
router.get("/all", function(req, res){
  memberList.find({}, {_id:0}, function(err, memberLists){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "myCurrentRating";
    memberLists.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });
    npRemoved = memberLists.filter(function(el) {
      return el.myCurrentRating !== 1500;
    });
    res.render("rating/vw_all_rating", {memberList:npRemoved, tid:70});
    });
});

router.get("/each/:id", function(req, res){

  listRanking.find({myname :  req.params.id}, {_id:0}, function(err, listRankings){
    if(err) return res.status(500).send({error: 'database find failure'});
    var sortingField = "listId";
    listRankings.sort(function(a, b) { // 내림차순
        return b[sortingField] - a[sortingField];
    });
    res.render("rating/vw_each_rating", {listRankings:listRankings, myname:req.params.id});
    });
});

router.get("/relative/:id", function(req, res){

  async.waterfall([
    function(callback){
              var listsets = [];
              listRanking.find({myname :  req.params.id}, {_id:0}, function(err, listRankings){
                if(err) return res.status(500).send({error: 'database find failure'});

                for ( var list1 = 0 ; list1 < listRankings.length ; list1++ ){
                    listsets.push(listRankings[list1]);
                };
                var sortingField = "listId";
                listsets.sort(function(a, b) { // 내림차순
                    return b[sortingField] - a[sortingField];
                });
                        var myrating = listsets[0].myCurrentRating;
                        callback(null, listsets);
                });
                //callback(null, listsets);;
    },
    function(listsets, callback){
        var oppList = [];
        for ( var op = 0 ; op < listsets.length ; op++ ){
          oppList.push(listsets[op].oppname);
        };
          callback(null, listsets, oppList);
    },
    function(listsets, oppList, callback){
            var myrating = listsets[0].myCurrentRating;
            var rvlist = [];
            var total_win = [];
            var total_loss = [];
            var totaldata={
              total_win : 0,
              total_loss : 0,
              total_winrate:0
            };
            for ( var op2 = 0 ; op2 < oppList.length ; op2++ ){
              var oppdata={
                oppname : "",
                rv_win : 0,
                rv_loss : 0,
                rv_winrate:0
              };
                for ( var rt = 0 ; rt < listsets.length ; rt++ ){
                  if(oppList[op2] == listsets[rt].oppname){
                    oppdata.oppname = listsets[rt].oppname;
                     if(listsets[rt].myScore > listsets[rt].oppScore){
                       oppdata.rv_win = oppdata.rv_win+1;
                       total_win.push(rt);
                     }
                     if(listsets[rt].myScore < listsets[rt].oppScore){
                       //oppdata.oppname = listsets[rt].oppname;
                        oppdata.rv_loss = oppdata.rv_loss+1;
                        total_loss.push(rt);
                     }
                  } // end if if(oppList[op] == listRankings[rt])
                }; // end for ( var rt = 0 ; rt < listRankings.length ; rt++ )
                oppdata.rv_winrate = oppdata.rv_win/(oppdata.rv_loss+oppdata.rv_win)*100;
                rvlist.push(oppdata);

            };

            callback(null, rvlist, total_win, total_loss, myrating);
    }

  ], function (err, rvlist, total_win, total_loss, myrating) {
        var t_win = total_win.length;
        var t_loss = total_loss.length;
        var total_winrate = t_win/(t_win+t_loss)*100;
        res.render("rating/vw_relative_rating", {relativeList:rvlist, myname:req.params.id, myrating:myrating,
                            total_win:t_win, total_loss:t_loss,total_winrate:total_winrate });

  });
});


module.exports = router;

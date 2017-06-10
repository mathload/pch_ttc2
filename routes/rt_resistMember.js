var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var async    = require('async');
var util     = require("../util");
var memberList = require('../models/md_memberList');
var gbkt_each = require('../models/gbkt_each');
var glicko2 = require('glicko2-lite');


router.get('/', function(req,res){
res.render("vw_app/resistPlayer");
}); // end of  router


// CREATE BOOK
router.post('/', function(req, res){
  // console.log('plauername='+req.body.playerName_e);
  // nameq = req.body.playerName_e;
  // var playerRT = {
  nameq = req.body.playerName_e;
  gradeq = req.body.playerGrade_e;
  sexq = req.body.sex_e;
  memberShipq = req.body.membership_e;


  var pRanking = new memberList;
      pRanking.myname = nameq;
      pRanking.grade=gradeq;
      pRanking.sex= sexq;
      pRanking.memberShip= memberShipq;
      pRanking.myBeforeRating = 1500;
      pRanking.myCurrentRating = 1500;
      pRanking.rd = 350;
      pRanking.vol = 0.06;
      pRanking.no_win = 0.;
      pRanking.no_loss = 0.;
      pRanking.winRate = 0.;

    pRanking.save(function(err, memberList){
        if(err) return console.error(err);
   }); // END of pRanking.save(

  res.render("rating/vw_memberResist");
});



router.get('/view', function(req,res){
  var vname = "홍길동";
  memberList.find({"name": vname}, {_id:0,}, function(err, memberLists){
      if(err) return res.status(500).send({error: 'database find failure'});
      var  ts;
      var me = {
        rating: memberLists[0].rating,
        rd: memberLists[0].rd,
        vol: memberLists[0].vol
      };
      var you = {rating: 1400, rd: 30, vol: 0.06};

      myranking = glicko2(me.rating, me.rd, me.vol, [
        [you.rating, you.rd, 0]
      ], {tau: 0.5});

      console.log('myranking='+myranking.rating);
      res.render("vw_app/resistPlayer", {data_A:ts});
      });
  });



    module.exports = router;

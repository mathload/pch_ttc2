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


router.post('/', function(req, res){
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
      pRanking.beforerank = 100;

    pRanking.save(function(err, memberList){
        if(err) return console.error(err);
   }); // END of pRanking.save(

  res.render("rating/vw_memberResist");
});




    module.exports = router;

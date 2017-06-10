var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var async    = require('async');
var util     = require("../util");
var ResultSet     = require('../models/md_resultSet');
var gbkt_each = require('../models/gbkt_each');
var mtnt_low32 = require('../models/tntbrkt_low32');

// GET ALL BOOKS
router.get('/', function(req,res){
  var ts;
  var gd;
  var sidc;
  var p_name = [];
  gbkt_each.find({gid : 10}, {_id:0, group_each:1, gameDate:1, gid :1}, function(err, gbkt_eachs){
    if(err) return res.status(500).send({error: 'database find failure'});
    ts = gbkt_eachs[0].group_each;
    gd = gbkt_eachs[0].gameDate;
    sidc = gbkt_eachs[0].gid;
  //});

  // console.log('ts='+ts);
  var no_match = JSON.stringify(ts.matches.length, undefined, 2);
  var no_player = JSON.stringify(ts.teams.length, undefined, 2);

  for ( var n = 0 ; n < no_player ; n++ ){
    //p_name.push(JSON.stringify(ts.teams[n].name));
    p_name.push(ts.teams[n].name);
  };

  for ( var i = 0 ; i < no_match ; i++ ){
    // a_teamsid = JSON.stringify(ts.matches[i].a.team, undefined, 2);
    // b_teamsid = JSON.stringify(ts.matches[i].b.team, undefined, 2);
    a_teamsid = ts.matches[i].a.team;
    b_teamsid = ts.matches[i].b.team;
    pname_a = p_name[a_teamsid];
    pname_b = p_name[b_teamsid];
    a_score = JSON.stringify(ts.matches[i].a.score, undefined, 2);
    b_score = JSON.stringify(ts.matches[i].b.score, undefined, 2);
      var  winner;
          if(a_score>b_score){
            winner=1;
          };
          if(a_score<b_score) {
            winner=0;
          };
          if(a_score==b_score) {
            winner=0.5;
          };

      var resultSet = new ResultSet({
        gamename:"",
        pName1: pname_a,
        pName2: pname_b,
        score1: a_score,
        score2: b_score,
        result: winner,
        gDate: gd,
        sid: sidc
      });

    // resultSet.resetCount(function(err, nextCount) {   
    //         });

    resultSet.save(function(err, ResultSet){
        if(err) return console.error(err);
        //console.dir(book);
    });

    }; // end of no_match
  });
  res.redirect('/');
}); // end of  router







    // GET SINGLE BOOK
    router.get('/tnt32', function(req, res){
    mtnt_low32.find({gid : 31}, {_id:0, tnt_l32:1, gameDate:1, gid :1}, function(err, mtnt_low32s){
      if(err) return res.status(500).send({error: 'database find failure'});

    var ts = mtnt_low32s[0].tnt_l32;
    gd = mtnt_low32s[0].gameDate;
    sidc = mtnt_low32s[0].gid;

    var round2_name=[];
    for(var idx = 0; idx<8; idx++)
        {
          round2_name[idx] = new Array();
        }
    var round3_name=[];
    for(var idx = 0; idx<4; idx++)
        {
          round3_name[idx] = new Array();
        }
    var round4_name=[];
    for(var idx = 0; idx<2; idx++)
        {
          round4_name[idx] = new Array();
        }
    var round5_name=[];
    for(var idx = 0; idx<2; idx++)
        {
          round5_name[idx] = new Array();
        }

      for ( var rd1 = 0 ; rd1 < 16 ; rd1++ ){
        pname_a = ts.teams[rd1][0];
        pname_b = ts.teams[rd1][1];
        a_score = ts.results[0][0][rd1][0];
        b_score = ts.results[0][0][rd1][1];
          var  winner;
          if(pname_a==null || pname_b==null) {
            //console.log('nullnull도착='+'1');
                if(pname_a !==null && pname_b==null) {
                  round2_name[parseInt(rd1/2)][parseInt(rd1%2)]=pname_a;
                };
                if(pname_a==null && pname_b!== null) {
                  round2_name[parseInt(rd1/2)][parseInt(rd1%2)]=pname_b;
                };

          } else if(pname_a!==null && pname_b!==null) {
                //console.log('notnot도착='+'1');
              if(a_score>b_score){
                winner=1;
               round2_name[parseInt(rd1/2)][parseInt(rd1%2)]=pname_a;
              };
              if(a_score<b_score) {
                winner=0;
                round2_name[parseInt(rd1/2)][parseInt(rd1%2)]=pname_b;
              };
              if(a_score==b_score) {
                winner=0.5;
              };

            if(a_score==null || b_score==null) {
              winner=0.5;
            };

          var resultSet = new ResultSet({
            gamename:"",
            pName1: pname_a,
            pName2: pname_b,
            score1: a_score,
            score2: b_score,
            result: winner,
            gDate: gd,
            sid: sidc
          });

       };

        resultSet.save(function(err, ResultSet){
            if(err) return console.error(err);
            //console.dir(book);
        }); // resultSet.save
      } // end for loop


      for ( var rd2 = 0 ; rd2 < 8 ; rd2++ ){
        // a_teamsid = ts.matches[i].a.team;
        // b_teamsid = ts.matches[i].b.team;
        pname_a = round2_name[rd2][0];
        pname_b = round2_name[rd2][1];
        a_score = ts.results[0][1][rd2][0];
        b_score = ts.results[0][1][rd2][1];
          var  winner;
              if(a_score>b_score){
                winner=1;
               round3_name[parseInt(rd2/2)][parseInt(rd2%2)]=pname_a;
              };
              if(a_score<b_score) {
                winner=0;
                round3_name[parseInt(rd2/2)][parseInt(rd2%2)]=pname_b;
              };
              if(a_score==b_score) {
                winner=0.5;
              };

            if(a_score==null || b_score==null) {
              winner=0.5;
            };

          var resultSet = new ResultSet({
            gamename:"",
            pName1: pname_a,
            pName2: pname_b,
            score1: a_score,
            score2: b_score,
            result: winner,
            gDate: gd,
            sid: sidc
          });



        resultSet.save(function(err, ResultSet){
            if(err) return console.error(err);
        }); // resultSet.save
      } // end for loop

      for ( var rd3 = 0 ; rd3 < 4 ; rd3++ ){
        // a_teamsid = ts.matches[i].a.team;
        // b_teamsid = ts.matches[i].b.team;
        pname_a = round3_name[rd3][0];
        pname_b = round3_name[rd3][1];
        a_score = ts.results[0][2][rd3][0];
        b_score = ts.results[0][2][rd3][1];
          var  winner;
              if(a_score>b_score){
                winner=1;
               round4_name[parseInt(rd3/2)][parseInt(rd3%2)]=pname_a;
              };
              if(a_score<b_score) {
                winner=0;
                round4_name[parseInt(rd3/2)][parseInt(rd3%2)]=pname_b;
              };
              if(a_score==b_score) {
                winner=0.5;
              };

            if(a_score==null || b_score==null) {
              winner=0.5;
            };

          var resultSet = new ResultSet({
            gamename:"",
            pName1: pname_a,
            pName2: pname_b,
            score1: a_score,
            score2: b_score,
            result: winner,
            gDate: gd,
            sid: sidc
          });


        //
        resultSet.save(function(err, ResultSet){
            if(err) return console.error(err);
        }); // resultSet.save
      } // end for loop

      for ( var rd4 = 0 ; rd4 < 2 ; rd4++ ){
        // a_teamsid = ts.matches[i].a.team;
        // b_teamsid = ts.matches[i].b.team;
        pname_a = round4_name[rd4][0];
        pname_b = round4_name[rd4][1];
        a_score = ts.results[0][3][rd4][0];
        b_score = ts.results[0][3][rd4][1];
          var  winner;
              if(a_score>b_score){
                winner=1;
               round5_name[parseInt(rd4/2)][parseInt(rd4%2)]=pname_a;
               round5_name[1][parseInt(rd4%2)]=pname_b;
              };
              if(a_score<b_score) {
                winner=0;
                round5_name[parseInt(rd4/2)][parseInt(rd4%2)]=pname_b;
                round5_name[1][parseInt(rd4%2)]=pname_a;
              };
              if(a_score==b_score) {
                winner=0.5;
              };

            if(a_score==null || b_score==null) {
              winner=0.5;
            };

          var resultSet = new ResultSet({
            gamename:"",
            pName1: pname_a,
            pName2: pname_b,
            score1: a_score,
            score2: b_score,
            result: winner,
            gDate: gd,
            sid: sidc
          });



        resultSet.save(function(err, ResultSet){
            if(err) return console.error(err);
        }); // resultSet.save
      } // end for loop

      for ( var rd5 = 0 ; rd5 < 2 ; rd5++ ){

        pname_a = round5_name[rd5][0];
        pname_b = round5_name[rd5][1];
        a_score = ts.results[0][4][rd5][0];
        b_score = ts.results[0][4][rd5][1];
          var  winner;
          if(a_score==null || b_score==null) {
            winner=2;
          } else if(a_score!==null && b_score!==null) {
            winner=2;

              if(a_score>b_score){
                winner=1;
              //  round5_name[parseInt(rd4/2)][parseInt(rd4%2)]=pname_a;
              //  round5_name[1][parseInt(rd4%2)]=pname_b;
              };
              if(a_score<b_score) {
                winner=0;
                // round5_name[parseInt(rd4/2)][parseInt(rd4%2)]=pname_b;
                // round5_name[1][parseInt(rd4%2)]=pname_a;
              };
              if(a_score==b_score) {
                winner=0.5;
              };

            if(a_score==null || b_score==null) {
              winner=2;
            };

          var resultSet = new ResultSet({
            gamename:"",
            pName1: pname_a,
            pName2: pname_b,
            score1: a_score,
            score2: b_score,
            result: winner,
            gDate: gd,
            sid: sidc
          });



        resultSet.save(function(err, ResultSet){
            if(err) return console.error(err);
        }); // resultSet.save
         }
      } // end for loop

      console.log('round5_name='+round5_name);
      res.redirect('/');
      });// mtnt_low32.find
    }); // end of 라우터 get/tnt32





    // GET BOOK BY AUTHOR
    router.get('/api/books/author/:author', function(req, res){
        res.end();
    });

    // CREATE BOOK
    router.post('/api/books', function(req, res){
        res.end();
    });

    // UPDATE THE BOOK
    router.put('/api/books/:book_id', function(req, res){
        res.end();
    });

    // DELETE BOOK
    router.delete('/api/books/:book_id', function(req, res){
        res.end();
    });

    module.exports = router;

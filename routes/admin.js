var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var gbook     = require('../models/gbook');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var dolist = require('../models/md_todolist');
var rbsm = require('../models/md_sm_rb');
var robin = require('roundrobin');
var memberList = require('../models/md_memberList');
var listRanking = require('../models/md_listRanking');
var glicko2 = require('glicko2-lite');
var mtnt_all = require('../models/md-tntbracket_all');
// index
router.get('/', function(req,res){
  res.render("rating/vw_admin");
});

// new
router.get('/newmember', isLoggedIn, function(req,res){
  res.render("rating/vw_memberResist");
});

router.get('/resistgame', function(req,res){
  dolist.find({dolistid : 100}, {_id:0, todolist:1, donelist:1}, function(err, dolists){
    if(err) return res.status(500).send({error: 'database find failure'});
    todolista = dolists[0].todolist;
    donelista = dolists[0].donelist;
    var robinlist = [];
    var tntlist = [];
     for(i=0; i< todolista.length; i++){
       var idfygameArr = todolista[i].split('-');
       if(idfygameArr[1] == 'rb' ){
         robinlist.push(todolista[i]);
       }
       if(idfygameArr[1] == 'tnt'){
         tntlist.push(todolista[i]);
       }
     }
  res.render("rating/vw_gamelist" ,{todolist:todolista, robinlist:robinlist, tntlist:tntlist,donelist:donelista});
});
});

router.post('/docrbsms', isLoggedIn, function(req,res){
    var initSet = new rbsm({
      matchid: req.body.rbsmsid,
      //rbsmid: {type:Number},
      rbsmplist: []
  });
initSet.save(function(err, ResultSet){
    if(err) return console.error(err);
});
  res.redirect('back');
});

router.post('/createtnt', isLoggedIn, function(req,res){
  var starter = new mtnt_all;
  starter.gameid = req.body.tntid;
  var snt ={
    teams : 'none',
    results : 'win'
  }
  starter.tnt_all = snt;
  starter.save(function(err, starters){
      if(err) return console.error(err);
  }); // resultSet.save
  res.redirect('back');
});


router.post('/todolist', isLoggedIn, function(req,res){
  dolist.find({dolistid : 100}, {_id:0, todolist:1, donelist:1}, function(err, dolists){
    if(err) return res.status(500).send({error: 'database find failure'});
    todolista = dolists[0].todolist;
    //donelista = dolists[0].donelist;
    todolista.push(req.body.todogameid);
    //slist = req.body.todogameid;
    dolist.findOneAndUpdate({dolistid : 100},
    {todolist:todolista},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, dolists) {
      if(error){
          console.log("Something wrong when updating data!");
      }
    res.redirect('back');
  });
  });
});

router.post('/tntrating', function(req,res){
  dolist.find({dolistid : 100}, {_id:0, todolist:1, donelist:1}, function(err, dolists){
    if(err) return res.status(500).send({error: 'database find failure'});
    todolista = dolists[0].todolist;
    donelista = dolists[0].donelist;

    var chk = 'notexit';
    for (i=0; i < donelista.length; i++){
      if(donelista[i] == req.body.gameID){
        chk = 'exist';
      }
    }
    if(chk !=='exist'){
    donelista.push(req.body.gameID);
      }
    var todolistb =[];
    for (i=0; i < todolista.length; i++){
      if(todolista[i] !==req.body.gameID){
        todolistb.push(todolista[i]);
      }
    };
    dolist.findOneAndUpdate({dolistid : 100},
    {donelist:donelista, todolist:todolistb },
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, dolists) {
      if(error){
          console.log("Something wrong when updating data!");
      }
    //res.redirect('back');
    });
  });

 var tntidArr = (req.body.gameID).split('-');
 if(tntidArr[2] == 8){

 }
 if(tntidArr[2] == 16){

 }
 if(tntidArr[2] == 32){
   mtnt_all.find({gameid : req.body.gameID}, {_id:0, tnt_all:1, gameDate:1}, function(err, mtnt_alls){
     if(err) return res.status(500).send({error: 'database find failure'});

   var ts = mtnt_alls[0].tnt_all;
   gd = mtnt_alls[0].gameDate;
  //  sidc = mtnt_low32s[0].gid;
  var resultSet = [];
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
               if(pname_a !==null && pname_b==null) {
                 round2_name[parseInt(rd1/2)][parseInt(rd1%2)]=pname_a;
               };
               if(pname_a==null && pname_b!== null) {
                 round2_name[parseInt(rd1/2)][parseInt(rd1%2)]=pname_b;
               };

         }
         if(pname_a!==null && pname_b!==null) {
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

         var rSet = {
           pName1: pname_a,
           pName2: pname_b,
           score1: a_score,
           score2: b_score,
           result: winner,
         }
         if(a_score!==null && b_score!==null) {
          resultSet.push(rSet);
         };
      };
     } // end for loop

     for ( var rd2 = 0 ; rd2 < 8 ; rd2++ ){
       pname_a = round2_name[rd2][0];
       pname_b = round2_name[rd2][1];
       a_score = ts.results[0][1][rd2][0];
       b_score = ts.results[0][1][rd2][1];
         var  winner;
         if(pname_a==null || pname_b==null) {
               if(pname_a !==null && pname_b==null) {
                 round3_name[parseInt(rd2/2)][parseInt(rd2%2)]=pname_a;
               };
               if(pname_a==null && pname_b!== null) {
                 round3_name[parseInt(rd2/2)][parseInt(rd2%2)]=pname_b;
               };

         }
        if(pname_a!==null && pname_b!==null) {
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

           var rSet = {
             pName1: pname_a,
             pName2: pname_b,
             score1: a_score,
             score2: b_score,
             result: winner,
           }
           if(a_score!==null && b_score!==null && pname_a!==null && pname_b!==null) {
            resultSet.push(rSet);
           };
         };
     } // end for loop

     for ( var rd3 = 0 ; rd3 < 4 ; rd3++ ){
       pname_a = round3_name[rd3][0];
       pname_b = round3_name[rd3][1];
       a_score = ts.results[0][2][rd3][0];
       b_score = ts.results[0][2][rd3][1];
         var  winner;
         if(pname_a==null || pname_b==null) {
               if(pname_a !==null && pname_b==null) {
                 round4_name[parseInt(rd3/2)][parseInt(rd3%2)]=pname_a;
               };
               if(pname_a==null && pname_b!== null) {
                 round4_name[parseInt(rd3/2)][parseInt(rd3%2)]=pname_b;
               };

         }
        if(pname_a!==null && pname_b!==null) {
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
          //  console.log(' pname_b='+pname_a+pname_b) );
           var rSet = {
             pName1: pname_a,
             pName2: pname_b,
             score1: a_score,
             score2: b_score,
             result: winner,
           }
           if(a_score!==null && b_score!==null && pname_a!==null && pname_b!==null) {
            resultSet.push(rSet);
           };
         };
     } // end for loop

     for ( var rd4 = 0 ; rd4 < 2 ; rd4++ ){
       pname_a = round4_name[rd4][0];
       pname_b = round4_name[rd4][1];
       a_score = ts.results[0][3][rd4][0];
       b_score = ts.results[0][3][rd4][1];
         var  winner;
         if(pname_a==null || pname_b==null) {
               if(pname_a !==null && pname_b==null) {
                 round5_name[parseInt(rd4/2)][parseInt(rd4%2)]=pname_a;
               };
               if(pname_a==null && pname_b!== null) {
                 round5_name[parseInt(rd4/2)][parseInt(rd4%2)]=pname_b;
               };

         }
        if(pname_a!==null && pname_b!==null) {
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

           var rSet = {
             pName1: pname_a,
             pName2: pname_b,
             score1: a_score,
             score2: b_score,
             result: winner,
           }
           if(a_score!==null && b_score!==null && pname_a!==null && pname_b!==null) {
            resultSet.push(rSet);
           };
         };
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
             };
             if(a_score<b_score) {
               winner=0;
             };
             if(a_score==b_score) {
               winner=0.5;
             };

           if(a_score==null || b_score==null) {
             winner=2;
           };

           var rSet = {
             pName1: pname_a,
             pName2: pname_b,
             score1: a_score,
             score2: b_score,
             result: winner,
           }
           if(a_score!==null && b_score!==null && pname_a!==null && pname_b!==null) {
            resultSet.push(rSet);
           };
        }
     } // end for loop
     mkratinglist(resultSet);
  }); // end find
 }  //  end ==32
 if(tntidArr[2] == 64){


 }

 res.redirect('back');
}); // end Router


router.post('/dorating', function(req,res){
  dolist.find({dolistid : 100}, {_id:0, todolist:1, donelist:1}, function(err, dolists){
    if(err) return res.status(500).send({error: 'database find failure'});
    todolista = dolists[0].todolist;
    donelista = dolists[0].donelist;

    var chk = 'notexit';
    for (i=0; i < donelista.length; i++){
      if(donelista[i] == req.body.gameID){
        chk = 'exist';
      }
    }
    if(chk !=='exist'){
    donelista.push(req.body.gameID);
      }
    var todolistb =[];
    for (i=0; i < todolista.length; i++){
      if(todolista[i] !==req.body.gameID){
        todolistb.push(todolista[i]);
      }
    };
    dolist.findOneAndUpdate({dolistid : 100},
    {donelist:donelista, todolist:todolistb },
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, dolists) {
      if(error){
          console.log("Something wrong when updating data!");
      }
    //res.redirect('back');
    });


  });

  var gameID = req.body.gameID;
  var strArr = gameID.split('-');
  var datea = strArr[2];
  var rsets = [];

  // if(strArr[1] == 'rb'){
  var pListi = [];
  rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
    if(err) return res.status(500).send({error: 'database find failure'});
    pListi = pLists[0].rbsmplist;
    //  console.log('pListi.length =' +pListi.length );
   var gorder = robin(pListi.length-1);
   for (i=0 ; i < gorder.length ; i++){
        for (j=0 ; j < gorder[0].length ; j++){
          a=gorder[i][j][0];
          b=gorder[i][j][1];
          var whowin;
          if(pListi[a][b] > pListi[b][a]){
            whowin = 1;
          }
          if(pListi[a][b] < pListi[b][a]){
            whowin = 0;
          }
          if(pListi[a][b] == pListi[b][a]){
            whowin = -1;
          }

          var resultset = {
          gid: gameID,
          pName1: pListi[a][0],
          pName2: pListi[b][0],
          score1: pListi[a][b],
          score2: pListi[b][a],
          result: whowin
          }
            //console.log('resultset =' +resultset );
         rsets.push(resultset);
        }
   }
    // }); //   ResultSet.find({},
 // } // end if rb


    //  console.log('rsets =' + rsets);



    var rst= -1;
  async.forEachLimit(rsets, 1, function(rset, userCallback){
    var my_id1;
    var your_id1;
    rst = rst+1

      async.waterfall([
          function(callback) {
            var playerList = [];
            memberList.find({}, {_id:0,}, function(err, memberLists){
                  if(err) return res.status(500).send({error: 'database find failure'});
                  for ( var pl = 0 ; pl < memberLists.length ; pl++ ){
                      playerList.push(memberLists[pl].myname);
                      };
                  //console.log('playerList ='+ playerList  );
                  callback(null, memberLists, playerList);
                });
          },
        function(memberLists, playerList, callback) {
          for ( var pl2 = 0 ; pl2 < playerList.length ; pl2++ ){
              //  console.log('rsets[rst]=' +rsets[rst] );
              if(rsets[rst].pName1 == memberLists[pl2].myname){
                my_id1= pl2;
                for ( var pl3 = 0 ; pl3 < playerList.length ; pl3++ ){
                  if(rsets[rst].pName2 == memberLists[pl3].myname){
                    your_id1=pl3;
                  }// end of if(rsets[rs].pName2
                }// end of for ( var pl3
                  var upRanking = new memberList;
                  var lRanking = new listRanking;
                  upRanking.myname = memberLists[my_id1].myname;
                  upRanking.myBeforeRating = memberLists[my_id1].myCurrentRating;
                  upRanking.oppname = memberLists[your_id1].myname;
                  //upRanking.currentDate = rsets[rst].gDate;
                  upRanking.myScore = rsets[rst].score1;
                  upRanking.oppScore = rsets[rst].score2;
                      if( rsets[rst].score1 > rsets[rst].score2){
                        upRanking.no_win = memberLists[my_id1].no_win+1;
                        upRanking.no_loss = memberLists[my_id1].no_loss;
                      } else if( rsets[rst].score1 < rsets[rst].score2){
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
                  var rset = rsets[rst].result;
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

                  //lRanking.gameid = rsets[rst].gid;
                  lRanking.myname =upRanking.myname;
                  lRanking.myCurrentRating =upRanking.myCurrentRating;
                  lRanking.myBeforeRating=upRanking.myBeforeRating;
                  lRanking.oppname=upRanking.oppname;
                  //lRanking.currentDate=upRanking.currentDate;
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
                //  console.log('upRanking.myname =' +upRanking );
          callback(null, upRanking, lRanking);
          },
          function(upRanking, lRanking, callback) {
            //console.log('upRanking =' +upRanking );
              memberList.findOneAndUpdate({myname: upRanking.myname},
                {myCurrentRating :upRanking.myCurrentRating,
                  myBeforeRating:upRanking.myBeforeRating,
                  oppname:upRanking.oppname,
                //currentDate:upRanking.currentDate,
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
                          }// end of if(rsets[rs].pName2
                        }// end of for ( var pl3

                          var upRanking = new memberList;
                          var lRanking = new listRanking;
                          upRanking.myname = memberLists[my_id1].myname;
                          upRanking.myBeforeRating = memberLists[my_id1].myCurrentRating;
                          upRanking.oppname = memberLists[your_id1].myname;
                          //upRanking.currentDate = rsets[rst].gDate;
                          upRanking.myScore = rsets[rst].score2;
                          upRanking.oppScore = rsets[rst].score1;
                              if( rsets[rst].score2 > rsets[rst].score1){
                                upRanking.no_win = memberLists[my_id1].no_win+1;
                                upRanking.no_loss = memberLists[my_id1].no_loss;
                              } else if( rsets[rst].score2 < rsets[rst].score1){
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
                          var rset = rsets[rst].result;
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
                        //lRanking.currentDate=upRanking.currentDate;
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
                  //currentDate:upRanking.currentDate,
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
          // result now equals 'done'
          //console.log('done')
          userCallback();
      });
  }, function(err){
      //console.log("User For Loop Completed");
     res.redirect("back");
  });
  //res.redirect("back");
}); //   ResultSet.find({},
//res.redirect("back");
});

// create
router.post('/', isLoggedIn, function(req,res){
  async.waterfall([function(callback){
    Counter.findOne({name:"gbooks"}, function (err,counter) {
      if(err) callback(err);
      if(counter){
         callback(null, counter);
      } else {
        Counter.create({name:"gbooks",totalCount:0},function(err,counter){
          if(err) return res.json({success:false, message:err});
          callback(null, counter);
        });
      }
    });
  }],function(callback, counter){
    var newgbook = req.body.gbook;
    newgbook.author = req.user._id;
    newgbook.numId = counter.totalCount+1;
    gbook.create(req.body.gbook,function (err,gbook) {
      if(err) return res.json({success:false, message:err});
      counter.totalCount++;
      counter.save();
      res.redirect('/gbooks');
    });
  });
});

// show
router.get('/:id', function(req,res){
  gbook.findById(req.params.id)
  .populate(['author','comments.author'])
  .exec(function (err,gbook) {
    if(err) return res.json({success:false, message:err});
    gbook.views++;
    gbook.save();
    res.render("gbooks/show", {gbook:gbook, urlQuery:req._parsedUrl.query,
      user:req.user, search:createSearch(req.query)});
  });
});

// edit
router.get('/:id/edit', isLoggedIn, function(req,res){
  gbook.findById(req.params.id, function (err,gbook) {
    if(err) return res.json({success:false, message:err});
    if(!req.user._id.equals(gbook.author)) return res.json({success:false, message:"Unauthrized Attempt"});
    res.render("gbooks/edit", {gbook:gbook, user:req.user});
  });
});

//update
router.put('/:id', isLoggedIn, function(req,res){
  req.body.gbook.updatedAt=Date.now();
  gbook.findOneAndUpdate({_id:req.params.id, author:req.user._id}, req.body.gbook, function (err,gbook) {
    if(err) return res.json({success:false, message:err});
    if(!gbook) return res.json({success:false, message:"No data found to update"});
    res.redirect('/gbooks');
  });
});

//destroy
router.delete('/:id', isLoggedIn, function(req,res){
  gbook.findOneAndRemove({_id:req.params.id, author:req.user._id}, function (err,gbook) {
    if(err) return res.json({success:false, message:err});
    if(!gbook) return res.json({success:false, message:"No data found to delete"});
    res.redirect('/gbooks');
  });
});

//create a comment
router.post('/:id/comments', function(req,res){
  var newComment = req.body.comment;
  newComment.author = req.user._id;
  gbook.update({_id:req.params.id},{$push:{comments:newComment}},function(err,gbook){
    if(err) return res.json({success:false, message:err});
    res.redirect('/gbooks/'+req.params.id+"?"+req._parsedUrl.query);
  });
});

//destroy a comment
router.delete('/:gbookId/comments/:commentId', function(req,res){
  gbook.update({_id:req.params.gbookId},{$pull:{comments:{_id:req.params.commentId}}},
    function(err,gbook){
      if(err) return res.json({success:false, message:err});
      res.redirect('/gbooks/'+req.params.gbookId+"?"+
                   req._parsedUrl.query.replace(/_method=(.*?)(&|$)/ig,""));
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("gbooksMessage","Please login first.");
  res.redirect('/login');
}

module.exports = router;

function createSearch(queries){
  var findgbook = {}, findUser = null, highlight = {};
  if(queries.searchType && queries.searchText && queries.searchText.length >= 3){
    var searchTypes = queries.searchType.toLowerCase().split(",");
    var gbookQueries = [];
    if(searchTypes.indexOf("title")>=0){
      gbookQueries.push({ title : { $regex : new RegExp(queries.searchText, "i") } });
      highlight.title = queries.searchText;
    }
    if(searchTypes.indexOf("body")>=0){
      gbookQueries.push({ body : { $regex : new RegExp(queries.searchText, "i") } });
      highlight.body = queries.searchText;
    }
    if(searchTypes.indexOf("author!")>=0){
      findUser = { nickname : queries.searchText };
      highlight.author = queries.searchText;
    } else if(searchTypes.indexOf("author")>=0){
      findUser = { nickname : { $regex : new RegExp(queries.searchText, "i") } };
      highlight.author = queries.searchText;
    }
    if(gbookQueries.length > 0) findgbook = {$or:gbookQueries};
  }
  return { searchType:queries.searchType, searchText:queries.searchText,
    findgbook:findgbook, findUser:findUser, highlight:highlight };
}


function mkratinglist(rsetArr){

  var playerList = [];
  var rsets = rsetArr;
  // console.log('rsets =' +rsets );
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
                      }// end of if(rsets[rs].pName2
                    }// end of for ( var pl3

                      var upRanking = new memberList;
                      var lRanking = new listRanking;
                      upRanking.myname = memberLists[my_id1].myname;
                      upRanking.myBeforeRating = memberLists[my_id1].myCurrentRating;
                      upRanking.oppname = memberLists[your_id1].myname;
                      //upRanking.currentDate = rsets[rst].gDate;
                      upRanking.myScore = rsets[rst].score1;
                      upRanking.oppScore = rsets[rst].score2;
                          if( rsets[rst].score1 > rsets[rst].score2){
                            upRanking.no_win = memberLists[my_id1].no_win+1;
                            upRanking.no_loss = memberLists[my_id1].no_loss;
                          } else if( rsets[rst].score1 < rsets[rst].score2){
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
                      var rset = rsets[rst].result;
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
                    //  lRanking.currentDate=upRanking.currentDate;
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
                  //currentDate:upRanking.currentDate,
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
                          }// end of if(rsets[rs].pName2
                        }// end of for ( var pl3

                          var upRanking = new memberList;
                          var lRanking = new listRanking;
                          upRanking.myname = memberLists[my_id1].myname;
                          upRanking.myBeforeRating = memberLists[my_id1].myCurrentRating;
                          upRanking.oppname = memberLists[your_id1].myname;
                        //  upRanking.currentDate = rsets[rst].gDate;
                          upRanking.myScore = rsets[rst].score2;
                          upRanking.oppScore = rsets[rst].score1;
                              if( rsets[rst].score2 > rsets[rst].score1){
                                upRanking.no_win = memberLists[my_id1].no_win+1;
                                upRanking.no_loss = memberLists[my_id1].no_loss;
                              } else if( rsets[rst].score2 < rsets[rst].score1){
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
                          var rset = rsets[rst].result;
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
                        //  lRanking.currentDate=upRanking.currentDate;
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
                //  currentDate:upRanking.currentDate,
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
 //   ResultSet.find({},
// res.redirect("/");


} // function mkratinglist

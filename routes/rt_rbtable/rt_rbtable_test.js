var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
//var passport = require('../config/passport.js');// to use passport authenticate methods - include와 같은 개념
var async  = require('async');
var util     = require("../../util");
//var ResultSet     = require('../../models/md_resultSet');
var rbsm = require('../../models/md_sm_rb');
var robin = require('roundrobin');
// Home
router.get("/:id", function(req, res){
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  var gname = strArr[4];
  var pListi = [];
  rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
    if(err) return res.status(500).send({error: 'database find failure'});
    pListi = pLists[0].rbsmplist;
    var hcol = [];
    var hlow = [];
    var count;
    count = pListi.length;
    hlow[0]='';
    for(var i=0; i<count; i++) {
      hlow[i+1]=i+1;
      hcol[i] = '';
    };
    hcol[count] = '승점(승-패)';
    hcol[count+1] = '순위';

    var dlist = [];
    for ( var i = 1 ; i < count ; i++ ){
      for ( var j = 1+i ; j < count ; j++ ){
            if(pListi[i][j]  && pListi[j][i] && i!==j ){
              dlist.push([i] + "-" + [j]);
            }
      }
    };
   var test = robin(count-1);
   var testArr = [];
   var gameorderArr = [];
   var gordermulti = [];
   for (i=0 ; i < test.length ; i++){
        for (j=0 ; j < test[0].length ; j++){
         testArr.push(test[i][j]);
        }
   }
   for (i=0 ; i < testArr.length ; i++){
     gameorderArr.push(testArr[i][0]+'#'+testArr[i][1]);
   }
     var col_no = 9;
     var row_no = parseInt(gameorderArr.length/col_no)+1;
     for (i=0 ; i < row_no; i++){
       gordermulti[i] = new Array();
      }

     for (i=0 ; i < gameorderArr.length ; i++){
       gordermulti[parseInt(i/col_no)][i%col_no]= gameorderArr[i];
     }

    var doneArr = [];
    for (k=0 ; k < dlist.length ; k++){
        var a = dlist[k].split('-');

         var tmpArr = [];
         for (i=0 ; i < gordermulti.length ; i++){
           for (j=0 ; j < gordermulti[0].length ; j++){
              if(gordermulti[i][j]){
                     var b = gordermulti[i][j].split('#');
                     if ( (a[0]==b[0] && a[1]==b[1]) || (a[0]==b[1] && a[1]==b[0]) ){
                       tmpArr[0]=i;
                       tmpArr[1]=j;
                       doneArr.push(tmpArr);
                     }
              }
           }
         }

   }
   var viewtype = 'detail';
    res.render("htable/rb_test", {pList:pListi,  gname:gname, gameID:gameID,ranklist:pListi,
               hlow:hlow,hcol:hcol,gordermulti:gordermulti, doneArr:doneArr,viewtype:viewtype});
}); // find
}); // router


router.get("/rankview/:id", function(req, res){
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  var gname = strArr[4];
  var pListi = [];
  var ranklist = [];
  rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
    if(err) return res.status(500).send({error: 'database find failure'});
    pListi = pLists[0].rbsmplist;
    var hcol2 = [];
    var hlow2 = [];
    var count;
    count = pListi.length;
    for(var i=0; i<count-1; i++) {
      ranklist[i] = new Array(3);
    }
    pListi.sort(function(a, b){
      return a[count+1]-b[count+1]
    });

    hlow2[0]='';
    // for(var i=0; i<count; i++) {
    //   hlow[i+1]=i+1;
    //   hcol2[i] = '';
    // };
    hcol2[0] = '순위';
    hcol2[1] = '이름';
    hcol2[2] = '승점(승-패)';
    for(var i=0; i<count-1; i++) {
      hlow2[i+1]='';
      ranklist[i][0] = pListi[i+1][count+1];
      ranklist[i][1] = pListi[i+1][0];
      ranklist[i][2] = pListi[i+1][count];
    }

    var dlist = [];
    for ( var i = 1 ; i < count ; i++ ){
      for ( var j = 1+i ; j < count ; j++ ){
            if(pListi[i][j]  && pListi[j][i] && i!==j ){
              dlist.push([i] + "-" + [j]);
            }
      }
    };
   var test = robin(count-1);
   var testArr = [];
   var gameorderArr = [];
   var gordermulti = [];
   for (i=0 ; i < test.length ; i++){
        for (j=0 ; j < test[0].length ; j++){
         testArr.push(test[i][j]);
        }
   }
   for (i=0 ; i < testArr.length ; i++){
     gameorderArr.push(testArr[i][0]+'#'+testArr[i][1]);
   }
     var col_no = 9;
     var row_no = parseInt(gameorderArr.length/col_no)+1;
     for (i=0 ; i < row_no; i++){
       gordermulti[i] = new Array();
      }

     for (i=0 ; i < gameorderArr.length ; i++){
       gordermulti[parseInt(i/col_no)][i%col_no]= gameorderArr[i];
     }

    var doneArr = [];
    for (k=0 ; k < dlist.length ; k++){
        var a = dlist[k].split('-');

         var tmpArr = [];
         for (i=0 ; i < gordermulti.length ; i++){
           for (j=0 ; j < gordermulti[0].length ; j++){
              if(gordermulti[i][j]){
                     var b = gordermulti[i][j].split('#');
                     if ( (a[0]==b[0] && a[1]==b[1]) || (a[0]==b[1] && a[1]==b[0]) ){
                       tmpArr[0]=i;
                       tmpArr[1]=j;
                       doneArr.push(tmpArr);
                     }
              }
           }
         }

   }
    var viewtype = 'rank';
    res.render("htable/rb_test", {pList:pListi,ranklist:ranklist, gname:gname, gameID:gameID,
               hlow:hlow2,hcol:hcol2,viewtype:viewtype,gordermulti:gordermulti, doneArr:doneArr});
}); // find
}); // router

router.post('/substitute/:id', function(req, res){
  async.waterfall([
  function(callback){
    var nameout = req.body.outplayer;
    var namein = req.body.inplayer;
    var gameID = req.params.id;
    // console.log('nameout=' + nameout);
    // console.log('namein=' + namein);
    var hcol = [];
    var hlow = [];
    var count;
    rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
      if(err) return res.status(500).send({error: 'database find failure'});
      pListi = pLists[0].rbsmplist;
      count = pListi.length;
      for(var i=0; i<count; i++) {
        if(pListi[i][0] == nameout ){
          pListi[i][0] = namein;
          pListi[0][i] = namein;
        }
      }

      hlow[0]='';
      for(var i=0; i<count-1; i++) {
        hlow[i+1]=i+1;
        hcol[i] = '';
      };
      hcol[count-1] =  '';
      hcol[count] = '승점(승-패)';
      hcol[count+1] = '순위';
      callback(null, pListi, hcol, hlow, gameID);
      });
    //callback(null, pListi,gameID);
  },
  function(pListi, hcol, hlow, gameID, callback){
            var pListr = [];
            rbsm.findOneAndUpdate({matchid : gameID},
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
        var gname = strArr[4];
        res.redirect('back');
      //  console.log('pListr='+pListr);
      //  res.render("htable/rb_each", {pList:pListr,  gname:gname, gameID:gameID,hcol:hcol, hlow:hlow});
    callback(null, '끝');
  }
], function (err, result) {
   // result에는 '끝'이 담겨 온다.
});
//res.redirect('back');

});

router.post('/:id', function(req, res){
  async.waterfall([
  function(callback){
    var nameq = req.body.playerName;
    var gameID = req.params.id;
          var hcol = [];
          var hlow = [];
          var count;
          rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
            if(err) return res.status(500).send({error: 'database find failure'});
            pListi = pLists[0].rbsmplist;
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
            prelist[count][count] = '***';
            hlow[0]='';
            for(var i=0; i<count; i++) {
              hlow[i+1]=i+1;
              hcol[i] = '';
            };
            hcol[count] =  '';
            hcol[count+1] = '승점(승-패)';
            hcol[count+2] = '순위';
            callback(null, prelist, hcol, hlow, gameID);
          });
    //callback(null, pListi,gameID);
  },
  function(pListi, hcol, hlow, gameID, callback){
            var pListr = [];
            rbsm.findOneAndUpdate({matchid : gameID},
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
        var gname = strArr[4];
        res.redirect('back');
      //  console.log('pListr='+pListr);
      //  res.render("htable/rb_each", {pList:pListr,  gname:gname, gameID:gameID,hcol:hcol, hlow:hlow});
    callback(null, '끝');
  }
], function (err, result) {
   // result에는 '끝'이 담겨 온다.
});
//res.redirect('back');

});


router.post('/remove/:id', function(req, res){
  async.waterfall([
  function(callback){
    var namermv = req.body.rmvplayer;
    var gameID = req.params.id;
          var hcol = [];
          var hlow = [];
          var count;
          var colno;
          var nlist = [];
          var rvno ;
          rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
            if(err) return res.status(500).send({error: 'database find failure'});
            pListi = pLists[0].rbsmplist;
            count = pListi.length;
            colno = pListi[0].length;

            for(var i=0; i<count-1; i++) {
                nlist.push(pListi[i+1][0]);
            }
            for(var i=0; i<nlist.length; i++) {
                if(nlist[i] == namermv){
                  rvno = i;
                }
            }

            var prelist = new Array();
            for(var i=0; i<count-1; i++) {
              prelist[i] = new Array();
            }; // end for
            for(var i=0; i<rvno+1; i++) {
              for(var j=0; j<colno; j++) {
                if(j !== rvno+1 ){
                prelist[i].push(pListi[i][j]);
                 //prelist[i][j]=pListi[i][j];
               }
              };
            };

            for(var i=rvno+1; i<count-1; i++) {
              for(var j=0; j<colno; j++) {
                if(j !== rvno+1 ){
                prelist[i].push(pListi[i+1][j]);
                 //prelist[i][j]=pListi[i][j];
               }
              };
            };

            // prelist[0][count] = nameq;
            // prelist[count][0] = nameq;
            // prelist[count][count] = '*';
            hlow[0]='';
            for(var i=0; i<count-1; i++) {
              hlow[i+1]=i+1;
              hcol[i] = '';
            };
            hcol[count] =  '';
            hcol[count] = '승점(승-패)';
            hcol[count+1] = '순위';
            callback(null, prelist, hcol, hlow, gameID);
          });
    //callback(null, pListi,gameID);
  },
  function(pListi, hcol, hlow, gameID, callback){
            var pListr = [];
            rbsm.findOneAndUpdate({matchid : gameID},
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
        var gname = strArr[4];
        res.redirect('back');
      //  console.log('pListr='+pListr);
      //  res.render("htable/rb_each", {pList:pListr,  gname:gname, gameID:gameID,hcol:hcol, hlow:hlow});
    callback(null, '끝');
  }
], function (err, result) {
   // result에는 '끝'이 담겨 온다.
});
//res.redirect('back');

});

router.get("/init/:id", function(req, res){
  var gameID = req.params.id;
  var initdata = [["",null,null]];
  rbsm.findOneAndUpdate({matchid : gameID},
    {rbsmplist:initdata},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, result) {
      if(error){
          console.log("Something wrong when updating data!");
      }
    res.redirect('back');
  });
});

router.post("/savescore/:id", function(req, res){
  var rdata = req.body.savedata;
  var gameID = req.params.id;

  if(req.body.player1 !== req.body.player2){
  async.waterfall([
  function(callback){
    rbsm.find({matchid : gameID}, {_id:0, rbsmplist:1}, function(err, pLists){
      if(err) return res.status(500).send({error: 'database find failure'});
      pListi = pLists[0].rbsmplist;
        //console.log(' pListi=' +pListi[2] );
      var noplayer = pListi.length-1;
      var playerArr = [];
      var pindex1;
      var pindex2;
      for(pa = 0; pa < noplayer ; pa++){
        playerArr.push(pListi[0][pa+1])
      }

      for(pi = 0; pi < noplayer ; pi++){
        if(playerArr[pi] == req.body.player1){
          pindex1 = pi;
        }
        if(playerArr[pi] == req.body.player2){
          pindex2 = pi;
        }
      }
      pListi[pindex1+1][pindex2+1] = req.body.point1;
      pListi[pindex2+1][pindex1+1] = req.body.point2;

       callback(null, pListi, playerArr, noplayer);
      });

  },
  function(pListi, playerArr, noplayer, callback){
    var point_point = new Array(noplayer);
    var point_win = new Array(noplayer);
    var point_loss = new Array(noplayer);
    var rank = new Array(noplayer);
    for(col = 0; col < noplayer ; col++){
      pListi[col+1][noplayer+1]= 0;
      point_point[col]=0;
      point_win[col]=0;
      point_loss[col]=0;
      rank[col]=0;
    }

    for(me = 0; me < noplayer ; me++){
      for(you = 0; you < noplayer ; you++){
          if(pListi[me+1][you+1] && pListi[you+1][me+1]){
              a=Number(pListi[me+1][you+1]);
              b=Number(pListi[you+1][me+1]);
           if(a > b){
              point_win[me] = point_win[me]+1;
              point_point[me] = point_point[me]+2;
           }
           if(a < b){
              point_loss[me] = point_loss[me]+1;
              point_point[me] = point_point[me]+1;
           }
        } // if exsist
      } // for you
    } // for me
    for(col = 0; col < noplayer ; col++){
      pListi[col+1][noplayer+1]= point_point[col]+'('+point_win[col]+'-'+point_loss[col]+')';
    }
    // arg1는 '하나'고, arg2는 '둘'이다.
    callback(null, pListi, playerArr, noplayer, point_point );
  },
  function(pListi, playerArr, noplayer, point_point, callback){
    var point_index = new Array(noplayer);
    var rw_result = new Array(noplayer);
    var ss_arr = [];
    var f_arr = [];
    var sg_arr = new Array();
    var f_arr2 = [];

    for(pi = 0; pi < noplayer ; pi++){
      point_index[pi] = point_point[pi]*100+pi;
    }
    point_index.sort(function(a,b){// 내림차순
            return b-a;
    });

    //  승점에 따른 순위 부여 ==============승점 첫자리 수 기록===================================
    var p= 1000000;
    rw_result[0]= point_index[0]+p;
    var kp=0; // 여기가 맞나????
      for ( var i = 0 ; i < noplayer-1 ; i++ ){
        //var kp=0;
        if(parseInt(point_index[i]/100) > parseInt(point_index[i+1]/100)) {
          kp=0;
        } else {
          kp=kp+1;
        };// end of if
        //rw_result.push(r_result[i+1]+(i+2-kp)*p);
        rw_result[i+1]= point_index[i+1]+(i+2-kp)*p;
      }; // end of for

    // 승점 동점 배열 작성
    var flag = 0;
    var av = 0; // 변수는 for 문 바깥에 선언해야한다
      for ( var i = 0 ; i < noplayer-1 ; i++ ){
          if(parseInt(rw_result[i]/100) != parseInt(rw_result[i+1]/100)){
              if(flag == 0){
                ss_arr.push(0);

              } else {
                ss_arr.push(av);
                flag= 0;
              };

          } else {
            if(flag == 0){
              av = av+1
              ss_arr.push(av);
              flag = 1;
            } else {
              ss_arr.push(av);
            };
          }; // 1st if
      }; //end of for

    if(flag == 0){
      ss_arr.push(0);
    } else {
      ss_arr.push(av);
    };

      // console.log("ss_arr[2]=" +ss_arr);
    // 승점이 같으면 같은것끼리 배열로 분리하기 ================================
      for ( var i = 1 ; i < (noplayer+1)/2 ; i++ ){
      sg_arr[i] = new Array();
      for ( var j = 0 ; j < noplayer ; j++ ){
        if(ss_arr[j] == i){
            sg_arr[i].push(rw_result[j]);
        }; // end of if ss_arr
      }; // end of for j
      }; // end oof for i
     //console.log('sg_arr[1]='+sg_arr[1]);
    // 승점 동률이 아닌것의 최종 순서 정하는 루틴
    for ( var i = 0 ; i < noplayer ; i++ ){
    if(ss_arr[i] == 0) {
      // rw_result[i] = rw_result[i] + (i+1)*100000000000;
      f_arr2.push(rw_result[i]);
    }; // end of if
    }; // end of 승점 동률이 아닌것의 최종 순서 정하는 루틴

    var vc = sg_arr.length;
    var sendArr = [];
    for ( var i = 1 ; i < vc ; i++ ){
        if(sg_arr[i].length == 2) {
                for ( var ss = 0 ; ss < 2 ; ss++ ){
                sendArr[ss]=sg_arr[i][ss]
                }
        var check = (parseInt(sendArr[0]/100))%100;
        if(check !== 0){
        var result = new Array(2);
            result = same2(sendArr);
            for ( var ff = 0 ; ff < 2 ; ff++ ){
              f_arr2.push(result[ff]);
            }
        }
        if(check == 0){
              for ( var ff = 0 ; ff < 2 ; ff++ ){
                f_arr2.push(sendArr[ff]);
              }
        };
      };
   };
// SS=2

    var vc = sg_arr.length;
    var sendArr = [];
    for ( var i = 1 ; i < vc ; i++ ){
        if(sg_arr[i].length == 3) {
                for ( var ss = 0 ; ss < 3 ; ss++ ){
                sendArr[ss]=sg_arr[i][ss]
                }
        var check = (parseInt(sendArr[0]/100))%100;
        if(check !== 0){
        var result = new Array(3);
            result = same3(sendArr);
            for ( var ff = 0 ; ff < 3 ; ff++ ){
              f_arr2.push(result[ff]);
            }
        }
        if(check == 0){
              for ( var ff = 0 ; ff < 3 ; ff++ ){
                f_arr2.push(sendArr[ff]);
              }
        };
      };
    }; // end ss=3

    var vc = sg_arr.length;
    var sendArr =[];
    for ( var i = 1 ; i < vc ; i++ ){
        if(sg_arr[i].length == 4) {
                for ( var ss = 0 ; ss < 4 ; ss++ ){
                sendArr[ss]=sg_arr[i][ss]
                }
        var check = (parseInt(sendArr[0]/100))%100;
        if(check !== 0){
        var result = new Array(4);
            result = same4(sendArr);
            for ( var ff = 0 ; ff < 4 ; ff++ ){
              f_arr2.push(result[ff]);
            }
        }
        if(check == 0){
              for ( var ff = 0 ; ff < 4 ; ff++ ){
                f_arr2.push(sendArr[ff]);
              }
        };
      };
    }; // end ss=4

    var vc = sg_arr.length;
    var sendArr = [];
    for ( var i = 1 ; i < vc ; i++ ){
        if(sg_arr[i].length == 5) {
                for ( var ss = 0 ; ss < 5 ; ss++ ){
                sendArr[ss]=sg_arr[i][ss]
                }
        var check = (parseInt(sendArr[0]/100))%100;
        if(check !== 0){
        var result = new Array(5);
            result = same5(sendArr);
            for ( var ff = 0 ; ff < 5 ; ff++ ){
              f_arr2.push(result[ff]);
            }
        }
        if(check == 0){
              for ( var ff = 0 ; ff < 5 ; ff++ ){
                f_arr2.push(sendArr[ff]);
              }
        };
      };
    }; // end ss=5


    var vc = sg_arr.length;
    var sendArr = [];
    for ( var i = 1 ; i < vc ; i++ ){
        if(sg_arr[i].length == 6) {
                for ( var ss = 0 ; ss < 6 ; ss++ ){
                sendArr[ss]=sg_arr[i][ss]
                }
        var check = (parseInt(sendArr[0]/100))%100;
        if(check !== 0){
        var result = new Array(6);
            result = same6(sendArr);
            for ( var ff = 0 ; ff < 6 ; ff++ ){
              f_arr2.push(result[ff]);
            }
        }
        if(check == 0){
              for ( var ff = 0 ; ff < 6 ; ff++ ){
                f_arr2.push(sendArr[ff]);
              }
        };
      };
    }; // end ss=4

    var vc = sg_arr.length;
    var lt;
    var sendArr = new Array();
    for ( var i = 1 ; i < vc ; i++ ){
        if(sg_arr[i].length > 6) {
         lt=sg_arr[i].length;
                for ( var ss = 0 ; ss < lt ; ss++ ){
                sendArr[ss]=sg_arr[i][ss]
                }
        var check = (parseInt(sendArr[0]/100))%100;
        if(check !== 0){
        var result = new Array(lt);
            result = same7(sendArr);
            for ( var ff = 0 ; ff < lt ; ff++ ){
              f_arr2.push(result[ff]);
            }
        }
        if(check == 0){
              for ( var ff = 0 ; ff < lt ; ff++ ){
                f_arr2.push(sendArr[ff]);
              }
        };
      };
    }; // end ss=4



    function same2(result2){
      var p1_id= result2[0]%10;
      var p2_id= result2[1]%10;
      var p1_score=pListi[p1_id+1][p2_id+1];
      var p2_score=pListi[p2_id+1][p1_id+1];
      if(!p1_score || !p2_score){
          return result2;
      }
         if(p1_score > p2_score){
           result2[0] = result2[0]+10000;
           result2[1] = result2[1]+20000;
           return result2;
         }
         if(p1_score < p2_score){
           result2[0] = result2[0]+20000;
           result2[1] = result2[1]+10000;
           return result2;
         }
    }; // enf of funtion



    function same3(result3){
      var pidArr = new Array();
      for ( var i = 0 ; i < 3 ; i++ ){
          pidArr.push(result3[i]%10);
      }
      var pointArr = [0,0,0];
      var winArr = [0,0,0];
      var lossArr = [0,0,0];
      var ct1 = [0,0,1];
      var ct2 = [1,2,2];
      for(i3 = 0; i3 < 3 ; i3++){
        var p1_score=pListi[pidArr[ct1[i3]]+1][pidArr[ct2[i3]]+1];
        var p2_score=pListi[pidArr[ct2[i3]]+1][pidArr[ct1[i3]]+1];
        if(!p1_score || !p2_score){
          return result3;
        }
        if(p1_score > p2_score){
           pointArr[ct1[i3]]= pointArr[ct1[i3]]+2;
           pointArr[ct2[i3]]= pointArr[ct2[i3]]+1;
           winArr[ct1[i3]]= winArr[ct1[i3]]+ Number(p1_score);
           lossArr[ct1[i3]]= lossArr[ct1[i3]]+Number(p2_score);
           winArr[ct2[i3]]= winArr[ct2[i3]]+ Number(p2_score);
           lossArr[ct2[i3]]= lossArr[ct2[i3]]+Number(p1_score);
        }
        if(p1_score < p2_score){
           pointArr[ct2[i3]]= pointArr[ct2[i3]]+2;
           pointArr[ct1[i3]]= pointArr[ct1[i3]]+1;
           winArr[ct2[i3]]= winArr[ct2[i3]]+Number(p2_score);
           lossArr[ct2[i3]]= lossArr[ct2[i3]]+Number(p1_score);
           winArr[ct1[i3]]= winArr[ct1[i3]]+Number(p1_score);
           lossArr[ct1[i3]]= lossArr[ct1[i3]]+Number(p2_score);
        }
      };
      var point_index3 = new Array(3);
      for(j3 = 0; j3 < 3 ; j3++){
        point_index3[j3] = pointArr[j3]*10+j3;
      }
      var retio_index3 = new Array(3);
      for(k3 = 0; k3 < 3 ; k3++){
        retio_index3[k3] = parseInt(winArr[k3]/lossArr[k3]*100)*10+k3;
      }
      point_index3.sort(function(a,b){// 내림차순
          return b-a;
      });
      retio_index3.sort(function(a,b){// 내림차순
          return b-a;
      });
      if(pointArr[0] !== pointArr[1]){
         for(k3 = 0; k3 < 3 ; k3++){
           idx = point_index3[k3]%10;
           result3[idx] = result3[idx] + 10000 + k3*10000;
        }
        return result3;
      };
        if(pointArr[0] == pointArr[1]){
            if(parseInt(retio_index3[0]/10) !== parseInt(retio_index3[1]/10)){
             for(k3 = 0; k3 < 3 ; k3++){
               idx = retio_index3[k3]%10;
               result3[idx] = result3[idx] + 10000 + k3*10000;
            }
          return result3;
          }

          if(parseInt(retio_index3[0]/10) == parseInt(retio_index3[1]/10)){
           for(k3 = 0; k3 < 3 ; k3++){
             idx = retio_index3[k3]%10;
             result3[idx] = result3[idx] + 90000;
          }
          return result3;
        }
      };
    }; // enf of funtion


    function same4(result4){
      var f_result = [];
      var f_result2 = [];
      var f_result3 = [];
      var f_result4 = [];
      var pidArr = new Array();
      for ( var i = 0 ; i < 4 ; i++ ){
          pidArr.push(result4[i]%100);
      }
      var pointArr = [0,0,0,0];
      var winArr = [0,0,0,0];
      var lossArr = [0,0,0,0];
      var ct1 = [0,0,0,1,1,2];
      var ct2 = [1,2,3,2,3,3];
      for(i3 = 0; i3 < 6 ; i3++){
        var p1_score=pListi[pidArr[ct1[i3]]+1][pidArr[ct2[i3]]+1];
        var p2_score=pListi[pidArr[ct2[i3]]+1][pidArr[ct1[i3]]+1];
        if(!p1_score || !p2_score){
          return result4;
        }
        if(p1_score > p2_score){
           pointArr[ct1[i3]]= pointArr[ct1[i3]]+2;
           pointArr[ct2[i3]]= pointArr[ct2[i3]]+1;
           winArr[ct1[i3]]= winArr[ct1[i3]]+ Number(p1_score);
           lossArr[ct1[i3]]= lossArr[ct1[i3]]+Number(p2_score);
           winArr[ct2[i3]]= winArr[ct2[i3]]+ Number(p2_score);
           lossArr[ct2[i3]]= lossArr[ct2[i3]]+Number(p1_score);
        }
        if(p1_score < p2_score){
           pointArr[ct2[i3]]= pointArr[ct2[i3]]+2;
           pointArr[ct1[i3]]= pointArr[ct1[i3]]+1;
           winArr[ct2[i3]]= winArr[ct2[i3]]+Number(p2_score);
           lossArr[ct2[i3]]= lossArr[ct2[i3]]+Number(p1_score);
           winArr[ct1[i3]]= winArr[ct1[i3]]+Number(p1_score);
           lossArr[ct1[i3]]= lossArr[ct1[i3]]+Number(p2_score);
        }
      };
      var point_index3 = new Array(4);
      for(j3 = 0; j3 < 4 ; j3++){
        point_index3[j3] = pointArr[j3]*10+j3;
      }
      var retio_index3 = new Array(4);
      for(k3 = 0; k3 < 4 ; k3++){
        retio_index3[k3] = parseInt(winArr[k3]/lossArr[k3]*100)*10+k3;
      }
      point_index3.sort(function(a,b){// 내림차순
          return b-a;
      });
      retio_index3.sort(function(a,b){// 내림차순
          return b-a;
      });


      // ################  4명간 승점이 다 다른 경우 3-2-1-0
      if(parseInt(point_index3[0]/10) == 6 && parseInt(point_index3[1]/10) == 5 ){
           for(k3 = 0; k3 < 4 ; k3++){
             idx = point_index3[k3]%10;
             result4[idx] = result4[idx] + 10000 + k3*10000;
          }
          return result4;
      };

      // 4동률중 3동률의 처리=1=========[3-111]===========
      if(parseInt(point_index3[0]/10) == 6 && parseInt(point_index3[1]/10) == 4 ){
        for(kf = 0; kf < 4 ; kf++){
          result4[kf] = result4[kf] + 1000000;
        }
        idx = point_index3[0]%10;
        result4[idx] = result4[idx] - 1000000;
        f_result.push(result4[idx]);

       var sendArr = [];
           for ( var ff = 1 ; ff < 4 ; ff++ ){
             idx = point_index3[ff]%10;
             sendArr.push(result4[idx]);
           }
           result = same3(sendArr);
           for ( var rs = 0 ; rs < 3 ; rs++ ){
             f_result.push(result[rs]);
           }
        return f_result;
    }; // end [3-111]

    // 4-3 처리루틴2  ################ [222-0] #######
    if(parseInt(point_index3[2]/10) == 5 && parseInt(point_index3[3]/10) == 3 ){
      idx = point_index3[3]%10;
      result4[idx] = result4[idx] + 3000000;
      f_result2.push(result4[idx]);

     var sendArr = [];
         for ( var ff = 0 ; ff < 3 ; ff++ ){
           idx = point_index3[ff]%10;
           sendArr.push(result4[idx]);
         }
         result = same3(sendArr);
         for ( var rs = 0 ; rs < 3 ; rs++ ){
           f_result2.push(result[rs]);
         }
      return f_result2;
  }; // end [222-0]

// 2-2 상황처리 =====================[2211]-===========================
if(parseInt(point_index3[2]/10) == 4 && parseInt(point_index3[3]/10) == 4 ){
  idx = point_index3[2]%10;
  result4[idx] = result4[idx] + 2000000;
  idx = point_index3[3]%10;
  result4[idx] = result4[idx] + 2000000;

   var sendArr1 = [];
       for ( var ff = 0 ; ff < 2 ; ff++ ){
         idx = point_index3[ff]%10;
         sendArr1.push(result4[idx]);
       }
   result1 = same2(sendArr1);
   for ( var rs = 0 ; rs < 2 ; rs++ ){
     f_result3.push(result1[rs]);
   }

   var sendArr2 = [];
       for ( var ff = 2 ; ff < 4 ; ff++ ){
         idx = point_index3[ff]%10;
         sendArr2.push(result4[idx]);
       }
   result2 = same2(sendArr2);
   for ( var rs = 0 ; rs < 2 ; rs++ ){
     f_result3.push(result2[rs]);
   }
  return f_result3;
}; // end [2211]


// 2-2 상황처리 =====================[3300]-====================
if(parseInt(point_index3[0]/10) == 6 && parseInt(point_index3[1]/10) == 6 ){
  idx = point_index3[2]%10;
  result4[idx] = result4[idx] + 2000000;
  idx = point_index3[3]%10;
  result4[idx] = result4[idx] + 2000000;

   var sendArr1 = [];
       for ( var ff = 0 ; ff < 2 ; ff++ ){
         idx = point_index3[ff]%10;
         sendArr1.push(result4[idx]);
       }
   result = same2(sendArr1);
   for ( var rs = 0 ; rs < 2 ; rs++ ){
     f_result4.push(result[rs]);
   }

   var sendArr2 = [];
       for ( var ff = 2 ; ff < 4 ; ff++ ){
         idx = point_index3[ff]%10;
         sendArr2.push(result4[idx]);
       }
   result = same2(sendArr2);
   for ( var rs = 0 ; rs < 2 ; rs++ ){
     f_result4.push(result[rs]);
   }
  return f_result4;
}; // end [3300]-
}; // end function same4

function same5(result5){
  var f_result = [];
  var f_result2 = [];
  var f_result3 = [];
  var f_result4 = [];
  var pidArr = new Array();
  for ( var i = 0 ; i < 5 ; i++ ){
      pidArr.push(result5[i]%100);
  }

  var pointArr = [0,0,0,0,0];
  var winArr = [0,0,0,0,0];
  var lossArr = [0,0,0,0,0];
  var ct1 = [0,0,0,0,1,1,1,2,2,3];
  var ct2 = [1,2,3,4,2,3,4,3,4,4];
  for(i3 = 0; i3 < 10 ; i3++){
    var p1_score=pListi[pidArr[ct1[i3]]+1][pidArr[ct2[i3]]+1];
    var p2_score=pListi[pidArr[ct2[i3]]+1][pidArr[ct1[i3]]+1];
    if(!p1_score || !p2_score){
      return result5;
    }
    if(p1_score > p2_score){
       pointArr[ct1[i3]]= pointArr[ct1[i3]]+2;
       pointArr[ct2[i3]]= pointArr[ct2[i3]]+1;
       winArr[ct1[i3]]= winArr[ct1[i3]]+ Number(p1_score);
       lossArr[ct1[i3]]= lossArr[ct1[i3]]+Number(p2_score);
       winArr[ct2[i3]]= winArr[ct2[i3]]+ Number(p2_score);
       lossArr[ct2[i3]]= lossArr[ct2[i3]]+Number(p1_score);
    }
    if(p1_score < p2_score){
       pointArr[ct2[i3]]= pointArr[ct2[i3]]+2;
       pointArr[ct1[i3]]= pointArr[ct1[i3]]+1;
       winArr[ct2[i3]]= winArr[ct2[i3]]+Number(p2_score);
       lossArr[ct2[i3]]= lossArr[ct2[i3]]+Number(p1_score);
       winArr[ct1[i3]]= winArr[ct1[i3]]+Number(p1_score);
       lossArr[ct1[i3]]= lossArr[ct1[i3]]+Number(p2_score);
    }
  };
  var point_index3 = new Array(5);
  for(j3 = 0; j3 < 5 ; j3++){
    point_index3[j3] = pointArr[j3]*10+j3;
  }
  var retio_index3 = new Array(5);
  for(k3 = 0; k3 < 5 ; k3++){
    retio_index3[k3] = parseInt(winArr[k3]/lossArr[k3]*100)*10+k3;
  }
  point_index3.sort(function(a,b){// 내림차순
      return b-a;
  });
  retio_index3.sort(function(a,b){// 내림차순
      return b-a;
  });

// 5명간 비교시 승점이 다 다른경우 ========[4-3-2-1-0]===============
if(parseInt(point_index3[0]/10) == 8 && parseInt(point_index3[1]/10) == 7 ){
     for(k3 = 0; k3 < 5 ; k3++){
       idx = point_index3[k3]%10;
       result5[idx] = result5[idx] + 10000 + k3*10000;
    }
    return result4;
}; // end [4-3-2-1-0]


  // 다섯명의 승점이 모두 같은 경우 처리 루틴 ###########[22222]###
  if(parseInt(point_index3[0]/10) == 6 && parseInt(point_index3[1]/10) == 6 ){
       for(k3 = 0; k3 < 5 ; k3++){
         idx = retio_index3[k3]%10;
         result5[idx] = result5[idx] + 10000 + k3*10000;
      }
      return result4;
  }; // end [22222]

// 5-3 처리루틴1 ##################[333-1-0]###
if(parseInt(point_index3[1]/10) == 7 && parseInt(point_index3[2]/10) == 7 ){
idx = point_index3[3]%10;
result5[idx] = result5[idx] + 3000000;
f_result.push(result5[idx]);
idx = point_index3[4]%10;
result5[idx] = result5[idx] + 4000000;
f_result.push(result5[idx]);
var sendArr = [];
    for ( var ff = 0 ; ff < 3 ; ff++ ){
      idx = point_index3[ff]%10;
      sendArr.push(result5[idx]);
    }
    result = same3(sendArr);
    for ( var rs = 0 ; rs < 3 ; rs++ ){
      f_result.push(result[rs]);
    }
 return f_result;
}; // [333-1-0]

// 5-3 처리루틴2  ################ [3-222-1] #######ok##########
if(parseInt(point_index3[0]/10) == 7 && parseInt(point_index3[1]/10) == 6 ){
idx = point_index3[0]%10;
f_result2.push(result5[idx]);
idx = point_index3[1]%10;
result5[idx] = result5[idx] + 1000000;
idx = point_index3[2]%10;
result5[idx] = result5[idx] + 1000000;
idx = point_index3[3]%10;
result5[idx] = result5[idx] + 1000000;
idx = point_index3[4]%10;
result5[idx] = result5[idx] + 4000000;
f_result2.push(result5[idx]);

var sendArr = [];
    for ( var ff = 1 ; ff < 4 ; ff++ ){
      idx = point_index3[ff]%10;
      sendArr.push(result5[idx]);
    }
    result = same3(sendArr);
    for ( var rs = 0 ; rs < 3 ; rs++ ){
      f_result2.push(result[rs]);
    }
 return f_result2;
}; // [333-1-0]

  // 5동 2-2 처리 1 ##############[33-22-0]####
  if(parseInt(point_index3[3]/10) == 6 && parseInt(point_index3[4]/10) == 4 ){
    idx = point_index3[2]%10;
    result5[idx] = result5[idx] + 2000000;
    idx = point_index3[3]%10;
    result5[idx] = result5[idx] + 2000000;
    idx = point_index3[4]%10;
    result5[idx] = result5[idx] + 4000000;
    f_result3.push(result5[idx]);

    var sendArr1 = [];
        for ( var ff = 0 ; ff < 2 ; ff++ ){
          idx = point_index3[ff]%10;
          sendArr1.push(result5[idx]);
        }
        result = same2(sendArr);
        for ( var rs = 0 ; rs < 2 ; rs++ ){
          f_result3.push(result[rs]);
        }

        var sendArr2 = [];
        for ( var ff = 2 ; ff < 4 ; ff++ ){
          idx = point_index3[ff]%10;
          sendArr2.push(result5[idx]);
        }
        result = same2(sendArr);
        for ( var rs = 0 ; rs < 2 ; rs++ ){
          f_result3.push(result[rs]);
        }
  }; // [33-22-0]

// 5동 2-2 처리 2 #############################[33-2-11]#####
  if(parseInt(point_index3[3]/10) == 5 && parseInt(point_index3[4]/10) == 5 ){
    idx = point_index3[2]%10;
    result5[idx] = result5[idx] + 2000000;
    f_result4.push(result5[idx]);
    idx = point_index3[3]%10;
    result5[idx] = result5[idx] + 3000000;
    idx = point_index3[4]%10;
    result5[idx] = result5[idx] + 3000000;


    var sendArr1 = [];
        for ( var ff = 0 ; ff < 2 ; ff++ ){
          idx = point_index3[ff]%10;
          sendArr1.push(result5[idx]);
        }
        result = same2(sendArr);
        for ( var rs = 0 ; rs < 2 ; rs++ ){
          f_result4.push(result[rs]);
        }

    var sendArr2 = [];
        for ( var ff = 3 ; ff < 5 ; ff++ ){
          idx = point_index3[ff]%10;
          sendArr2.push(result5[idx]);
        }
        result = same2(sendArr);
        for ( var rs = 0 ; rs < 2 ; rs++ ){
          f_result4.push(result[rs]);
        }
  }; // [33-22-0]

}; // end function same5


  function same6(result6){
        return result6;
  };


  function same7(result7){
          return result7;
  };


  var sortArr = [];
  for ( var f = 0 ; f < f_arr2.length ; f++ ){
    sortArr[f] = parseInt(f_arr2[f]/100);
  }
  var sorted = sortArr.slice().sort(function(a,b){return a-b})
  var ranks = sortArr.slice().map(function(v){ return sorted.indexOf(v)+1 });

    for ( var f = 0 ; f < f_arr2.length ; f++ ){
       findx = f_arr2[f]%100;
       pListi[findx+1][noplayer+2]=ranks[f];
    }

    // f_arr2.sort(function(a,b){// 내림차순
    //         return a-b;
    // });
    //
    //
    // for ( var f = 0 ; f < f_arr2.length ; f++ ){
    //    findx = f_arr2[f]%100;
    //    pListi[findx+1][noplayer+2]=f+1
    // }

    callback(null, pListi );
  },

  function(pListi, callback){
    // arg1은 '셋'이다.
    rbsm.findOneAndUpdate({matchid : gameID},
      {rbsmplist:pListi},
      {new: true, upsert: true, setDefaultsOnInsert: true},
      function(error, pLists) {
        if(error){
            console.log("Something wrong when updating data!");
        }
        res.redirect('back');
    });

    callback(null, '끝');
  }
  ], function (err, result) {
     // result에는 '끝'이 담겨 온다.
  }); // end async
}  // end if same name
  // res.redirect('back');
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

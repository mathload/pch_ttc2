var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var gbkt_each = require('../models/gbkt_each');
var md_gRank = require('../models/md_groupRank');


router.get('/:id',isLoggedIn, function(req, res){
  var ts = "aaa";
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  var gname_id = Number(strArr[1]);
  var gname_type = strArr[0];
  var group_name1 = ['A조','B조','C조','D조','E조','F조'];
  var gname;
  var group_name2 = ['1그룹','2그룹','3그룹','4그룹','5그룹','6그룹','7그룹','8그룹'];
  var g_id = gname_id%10;
  // console.log("gname_type=" + gname_type);
    if(gname_type == 'sm'){
      for ( var sn = 0 ; sn < 6 ; sn++ ){
          if(g_id == sn){
            gname = group_name1[sn]
          };
      };
   };
  if(gname_type == 'ts' || gname_type == 'td'){
      for ( var sn = 0 ; sn < 8 ; sn++ ){
          if(g_id == sn){
            gname = group_name2[sn]
          };
     };
  };
  res.render("gbrackets/vw_eachgroup", {sdata:ts, gname:gname, gameID:gameID, user:req.user});
});

router.get('/main/teamEvent', function(req, res){
  var homePage = "teamEvent";
  res.render("pages/team_event");
});

router.get('/main/singleMatch', function(req, res){
  res.render("pages/single_match");
});

router.post('/:id',isLoggedIn, function(req,res){
//  console.log("라우터도착");
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  try {   
  var jsondata = JSON.parse(req.body.gdata);
  var data = new gbkt_each;
  var tid = 0;
  var fid = 0;
  tid = strArr[1];
  data.gid = tid;
  gameDate = new Date();
  var fid = 60+Number(tid);
  data.group_each = jsondata;
  gbkt_each.findOneAndUpdate({gid: data.gid},
    {group_each:jsondata, gameDate:gameDate},
    {new: true, upsert: true, setDefaultsOnInsert: true},
    function(error, gbkt_eachs) {
      if(error){
          console.log("Something wrong when updating data!");
      }
      var ts;
      ts = gbkt_eachs.group_each;
      //var gname = req.params.id;
      var gname = Number(strArr[1]);
      var testData = ts;


      var winpoint = 3;
      var arr1 = [];
      var arr2 = [];
      var point = [];
      var diff = [];
      var no_win = [];
      var no_lose = [];
      var each_point = [];
      var each_diff = [];
      var r_result = [];
      var rs_result = [];
      var rw_result = [];
      var ss_arr = [];
      var f_arr = [];
      var sg_arr = new Array();
      var f_arr2 = [];
      var group_name = [];
      var no_player = 0;
      //var no_match = testData.matches.length;
      var no_match = JSON.stringify(testData.matches.length, undefined, 2);
      var no_player = JSON.stringify(testData.teams.length, undefined, 2);
      var np = no_player-1;

      for ( var n = 0 ; n < no_player ; n++ ){
          var str = JSON.stringify(testData.teams[n].name);
          var pstr = JSON.parse(str);
          group_name[n] = "A-"+ n + "-" + pstr;
      }; // end of for 이름에 그룹명 붙이기

      for ( var n = 0 ; n < no_player ; n++ ){
          for ( var i = 0 ; i < no_match ; i++ ){
            a_teamsid = JSON.stringify(testData.matches[i].a.team, undefined, 2);
            b_teamsid = JSON.stringify(testData.matches[i].b.team, undefined, 2);
            if(a_teamsid == n){
              var a = JSON.stringify(testData.matches[i].a.score);
              var b = JSON.stringify(testData.matches[i].b.score);
              arr1.push(a);
              arr2.push(b);
                if(a>b){
                  point.push(winpoint);
                  diff.push(a-b);
                } else {
                  point.push(0);
                  diff.push(a-b);
                }
            } else if (b_teamsid == n) {
              var a= JSON.stringify(testData.matches[i].b.score);
              var b= JSON.stringify(testData.matches[i].a.score);
              arr1.push(a);
              arr2.push(b);
                if(a>b){
                  point.push(3);
                  diff.push(a-b);
                } else {
                  point.push(0);
                  diff.push(a-b);
                }

            }; // enf of else if
          }; // end of i
      }; // end of n

        for ( var nw = 0 ; nw < no_player ; nw++ ){
          no_win[nw] = 0;
          no_lose[nw] = 0;
            for ( var i = 0 ; i < no_match ; i++ ){
              a_teamsid = JSON.stringify(testData.matches[i].a.team, undefined, 2);
              b_teamsid = JSON.stringify(testData.matches[i].b.team, undefined, 2);
              if(a_teamsid == nw){
                var a = JSON.stringify(testData.matches[i].a.score);
                var b = JSON.stringify(testData.matches[i].b.score);
                  if(a>b){;
                    no_win[nw] = no_win[nw]+1;
                  }
                  if(a<b) {
                    no_lose[nw] = no_lose[nw]+1;
                  }

              };
              if (b_teamsid == nw) {
                var a= JSON.stringify(testData.matches[i].b.score);
                var b= JSON.stringify(testData.matches[i].a.score);
                  if(a>b){
                    no_win[nw] = no_win[nw]+1;
                  }
                  if(a<b) {;
                    no_lose[nw] = no_lose[nw]+1;
                  }

              }; // enf of else if
            }; // end of i
        }; // end of n

        for ( var i = 0 ; i < arr1.length ; i++ ){
          if(isNaN(arr1[i])){
             arr1[i] = 0;
          }
          if(isNaN(arr2[i])){
             arr2[i] = 0;
          }
          if(isNaN(diff[i])){
             diff[i] = 0;
          }
        };

    for ( var f2 = 0 ; f2 < no_player ; f2++ ){
      group_name[f2] = group_name[f2] + "-"+ no_win[f2] + "-" + no_lose[f2];
    };
    // console.log('group_name='+group_name);
    var k= 0;
    for ( var i = 0 ; i < no_player ; i++ ){
    var p= 0;
    var d= 0;
    for ( var j = 0 ; j < no_player-1 ; j++ ){

    p+= point[k];
    d+=diff[k];
    k++;

    }
    each_point.push(p);
    each_diff.push(d);
    };

    // null data = 0을 대입
    for ( var i = 0 ; i < no_player ; i++ ){
      each_point[i] = each_point[i]+0;
      each_diff[i] = each_diff[i]+0;
    };

    // 선수별 결과를 배열로 표현 =================================================
    for ( var i = 0 ; i < no_player ; i++ ){
    var r = 10000000000000;
    r=r+i;
    r=r+(each_point[i]*1000000000);
        if(each_diff[i] < 0){
          r=r+(-each_diff[i])*1000000;
        }
        if(each_diff[i] > 0){
          r=r+100000000+each_diff[i]*1000000;
        }
        if(each_diff[i] = 0){
          r=r+100000000+each_diff[i]*1000000;
        } // end of if
    r_result.push(r);
    r_result.sort(function(a,b){// 내림차순
            return b-a;
    }); // end of sort
    }; // end of for 선수별 결과를 배열로 표현 ======================


    //  승점에 따른 순위 부여 ==============승점 첫자리 수 기록===================================
    var p= 1000000000000;
    rw_result.push(r_result[0]+p);
    var kp=0; // 여기가 맞나????
      for ( var i = 0 ; i < no_player-1 ; i++ ){
        //var kp=0;
        if(parseInt(r_result[i]/1000000000) > parseInt(r_result[i+1]/1000000000)) {
          kp=0;
        } else {
          kp=kp+1;
        };// end of if
        rw_result.push(r_result[i+1]+(i+2-kp)*p);
      }; // end of for

    // 승점 동점 배열 작성
    var flag = 0;
    var av = 0; // 변수는 for 문 바깥에 선언해야한다
      for ( var i = 0 ; i < no_player-1 ; i++ ){
          if(parseInt(rw_result[i]/100000000000) != parseInt(rw_result[i+1]/100000000000)){
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
      for ( var i = 1 ; i < (no_player+1)/2 ; i++ ){
      sg_arr[i] = new Array();
      for ( var j = 0 ; j < no_player ; j++ ){
        if(ss_arr[j] == i){
            sg_arr[i].push(rw_result[j]);
        }; // end of if ss_arr
      }; // end of for j
      }; // end oof for i

    // 승점 동률이 아닌것의 최종 순서 정하는 루틴
    for ( var i = 0 ; i < no_player ; i++ ){
    if(ss_arr[i] == 0) {
      // rw_result[i] = rw_result[i] + (i+1)*100000000000;
      f_arr2.push(rw_result[i]);
    }; // end of if
    }; // end of 승점 동률이 아닌것의 최종 순서 정하는 루틴


    // 승점 동률인경우 처리 득실 포함 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    //for ( var i = 1 ; i < (no_player+1)/2 ; i++ ){
    for ( var i = 1 ; i < no_player-1 ; i++ ){
    // 2동률 처리루틴 >>>>>>>>>>>>>>>>>>>>>>>>>>> [ok] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      if(sg_arr[i].length == 2){
      var sg_arr2 = [];
          for ( var j = 0 ; j < 2 ; j++ ){
            sg_arr2.push(sg_arr[i][j]);
          };
      var a_diff =0;
      var a= sg_arr2[0]%10;
      var b= sg_arr2[1]%10;
      var fg = flag(a,b);
      a_diff = diff[a*np+b+fg];
         if(a_diff > 0){
           sg_arr2[0] = sg_arr2[0] + 100000000000;
           sg_arr2[1] = sg_arr2[1] + 200000000000;
           f_arr2.push(sg_arr2[0]);
           f_arr2.push(sg_arr2[1]);
         };
         if(a_diff == 0) {
           sg_arr2[0] = sg_arr2[0] + 800000000000;
           sg_arr2[1] = sg_arr2[1] + 800000000000;
           f_arr2.push(sg_arr2[0]);
           f_arr2.push(sg_arr2[1]);
         };
         if(a_diff < 0) {
           sg_arr2[0] = sg_arr2[0] + 200000000000;
           sg_arr2[1] = sg_arr2[1] + 100000000000;
           f_arr2.push(sg_arr2[0]);
           f_arr2.push(sg_arr2[1]);
         }; // end of if-diff
    }; // end of if length=2

    // 3동률 처리루틴 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ok>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    if(sg_arr[i].length == 3){
    var sg_arr3 = [];
    for ( var j = 0 ; j < 3 ; j++ ){
      sg_arr3.push(sg_arr[i][j]);
    };

    // 3동률의 처리
    var arr_id = [];
    var arr_each = [];
    var arr_wp = [];
    var arr_ratio = [];
    var wp_total = 0;
    for ( var j = 0 ; j < 3 ; j++ ){
      arr_id.push(sg_arr3[j]%10);
      arr_each[j] = new Array;
    }; // end of for j

    for ( var k = 0 ; k < 3 ; k++ ){
              // 3명 상대 각자의 득실 세트 산출 ok
       var fg1 = flag(arr_id[(k)%3], arr_id[(k+1)%3]);
       var fg2 = flag(arr_id[(k)%3], arr_id[(k+2)%3]);
       var ea_wp = 0;
       arr_each[k][0] = ( Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
       arr_each[k][1] = ( Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
             // 3명 비교하여 상대승점 계산
          for ( var l = 0 ; l < 2 ; l++ ){
            var fg = flag(arr_id[(k)%3], arr_id[(k+l+1)%3]);
            if(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg] > arr2[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg]){
              ea_wp = ea_wp + winpoint;
              // // alert("ea_wp="+ea_wp);
            };//end of if

          }; //end of for l
          arr_each[k][3]=(ea_wp);
          arr_wp.push(ea_wp); // ok
          arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
          arr_ratio.push(arr_each[k][4]); //ok
    };// end of for k
        //  // alert( "id는=" + arr_id[2] + "3명의 승점" +   arr_wp[2] + "득실률" + arr_ratio[2]);
        for ( var i3 = 0 ; i3 < arr_ratio.length ; i3++ ){
          if(isNaN(arr_wp[i3])){
             arr_wp[i3] = 0;
          };
          if(isNaN(arr_ratio[i3])){
             arr_ratio[i3] = 0;
          };
        };

         for ( var i4 = 0 ; i4 < arr_wp.length ; i4++ ){
           wp_total = wp_total+ arr_wp[i4];
         };

        if(wp_total < arr_wp.length*3){
            for ( var i5 = 0 ; i5 < arr_wp.length ; i5++ ){
              sg_arr3[i5] = sg_arr3[i5] + 800000000000
              f_arr2.push(sg_arr3[i5]);
            };
        }; // end of if

      // 3명간 비교하여 승점이 다른 경우 처리 루틴
    if(Math.max.apply(0, arr_wp) == 6){
         // alert( "승점이 다르다");
        for ( var j = 0 ; j < 3 ; j++ ){
            if(arr_each[j][3] == 6){
              //sg_arr3[j] = sg_arr3[j] + 200000000000 + 100000000000*flag_s3;
              sg_arr3[j] = sg_arr3[j] + 100000000000;
              f_arr2.push(sg_arr3[j]);
            } if(arr_each[j][3] == 3){
              //sg_arr3[j] = sg_arr3[j] + 300000000000 + 100000000000*flag_s3;
              sg_arr3[j] = sg_arr3[j] + 200000000000;
              f_arr2.push(sg_arr3[j]);
            } if(arr_each[j][3] == 0){
              // sg_arr3[j] = sg_arr3[j] + 400000000000 + 100000000000*flag_s3;
              sg_arr3[j] = sg_arr3[j] + 300000000000
              f_arr2.push(sg_arr3[j]);
            }
        }; // end for j
    };
    if(arr_wp[0]== arr_wp[1] && wp_total== 9) {
        // 3명간 비교시 승률이 같을때 ... 득실률 비교 루틴
            arr_ratio.sort(function(a,b){// 내림차순
               return b-a;     // 11, 10, 4, 3, 2, 1
            });

        if(arr_ratio[0] == arr_ratio[1]){ // 득실이 같을 때
            for ( var j = 0 ; j < 3 ; j++ ){
              sg_arr3[j] = sg_arr3[j] + 900000000000;
              f_arr2.push(sg_arr3[j]);
            }; // end of for j
        } else {   // 득실이 다를 때  ok
          for ( var j = 0 ; j < 3 ; j++ ){
              if(arr_each[j][4] == arr_ratio[0]){
                sg_arr3[j] = sg_arr3[j] + 100000000000;
                f_arr2.push(sg_arr3[j]);
              } else if(arr_each[j][4] == arr_ratio[1]){
                sg_arr3[j] = sg_arr3[j] + 200000000000;
                f_arr2.push(sg_arr3[j]);
              } else if(arr_each[j][4] == arr_ratio[2]){
                sg_arr3[j] = sg_arr3[j] + 300000000000;
                f_arr2.push(sg_arr3[j]);
              };
          }; // end for j
        };// end of if ratio
    }; // end of if max
  }; // end of if  3동률 처리왼료

    // 4동률 처리루틴 시작 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    if(sg_arr[i].length == 4){
    // alert("[4동률] 루틴 도착");
    var sg_arr4 = [];
    for ( var j = 0 ; j < 4 ; j++ ){
    sg_arr4.push(sg_arr[i][j]);
    };
    var arr_id = [];
    var arr_each = [];
    var arr_wp = [];
    var arr_ratio = [];
    var arr_s4 = [];
    var arr_s431 = [];
    var arr_s432 = [];
    var flag_s3 = 0;
    var arr_hs2 = [];
    var arr_ls2 = [];
    for ( var j = 0 ; j < 4 ; j++ ){
    arr_id.push(sg_arr4[j]%10);
    arr_each[j] = new Array;
    }; // end of for j

    // 4명간 승점 득실 계산 ********************ok***********************
    for ( var k = 0 ; k < 4 ; k++ ){
              // 4명 상대 각자의 득실 세트 산출 ok
       var fg1 = flag(arr_id[(k)%4], arr_id[(k+1)%4]);
       var fg2 = flag(arr_id[(k)%4], arr_id[(k+2)%4]);
       var fg3 = flag(arr_id[(k)%4], arr_id[(k+3)%4]);
       //var fg4 = flag(arr_id[(k)%4], arr_id[(k+4)%4]);
       var ea_wp = 0;
       arr_each[k][0] = ( Number(arr1[(arr_id[(k)%4]*np)+(arr_id[(k+1)%4])+fg1]) + Number(arr1[(arr_id[(k)%4]*np)+(arr_id[(k+2)%4])+fg2])
                          + Number(arr1[(arr_id[(k)%4]*np)+(arr_id[(k+3)%4])+fg3]));
       arr_each[k][1] = ( Number(arr2[(arr_id[(k)%4]*np)+(arr_id[(k+1)%4])+fg1]) + Number(arr2[(arr_id[(k)%4]*np)+(arr_id[(k+2)%4])+fg2])
                          + Number(arr2[(arr_id[(k)%4]*np)+(arr_id[(k+3)%4])+fg3]));
             // 4명 비교하여 상대승점 계산
          for ( var l = 0 ; l < 3 ; l++ ){
            var fg = flag(arr_id[(k)%4], arr_id[(k+l+1)%4]);
            if(arr1[(arr_id[(k)%4]*np)+(arr_id[(k+l+1)%4])+fg] > arr2[(arr_id[(k)%4]*np)+(arr_id[(k+l+1)%4])+fg]){
              ea_wp = ea_wp + winpoint;
              // // alert("ea_wp="+ea_wp);
            };//end of if

          }; //end of for l
          arr_each[k][3]=(ea_wp);
          arr_wp.push(ea_wp); // ok
          arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
          arr_ratio.push(arr_each[k][4]); //ok
    };// end of for k 4명간 승점처리  완료

    for ( var m1 = 0 ; m1 < arr_ratio.length ; m1++ ){
      if(isNaN(arr_wp[m1])){
         arr_wp[m1] = 0;
      }
      if(isNaN(arr_ratio[m1])){
         arr_ratio[m1] = 0;
      }
    };

    var no_9 = 0;
    var no_6 = 0;
    var no_3 = 0;
    var no_0 = 0;
    // 승점이 같은것의 갯수 기록
    for ( var k = 0 ; k < 4 ; k++ ){
    if(arr_wp[k]==9){
    no_9 = no_9+1;
    }
    if(arr_wp[k]==6){
    no_6 = no_6+1;
    }
    if(arr_wp[k]==3){
    no_3 = no_3+1;
    }
    if(arr_wp[k]==0){
    no_0 = no_0+1;
    }
    }; // end of for k

    // 4명간 비교시 승점이 다 다른경우 ========[3-2-1-0]==============================
    if(no_9 == 1 && no_6 == 1){
    // alert("4동률시 승점이 모두 다른경우 루틴 도착");
    for ( var j = 0 ; j < 4 ; j++ ){
    if(arr_each[j][3] == 9){
    sg_arr4[j] = sg_arr4[j] + 100000000000;
    f_arr2.push(sg_arr4[j]);
    }
    if(arr_each[j][3] == 6){
    sg_arr4[j] = sg_arr4[j] + 200000000000;
    f_arr2.push(sg_arr4[j]);
    }
    if(arr_each[j][3] == 3){
    sg_arr4[j] = sg_arr4[j] + 300000000000;
    f_arr2.push(sg_arr4[j]);
    }
    if(arr_each[j][3] == 0){
    sg_arr4[j] = sg_arr4[j] + 400000000000;
    f_arr2.push(sg_arr4[j]);
    }  // end of 5-if
    }; // end of for roop j
    }; // end of if no_**===[3-2-1-0]====처리 완료 --------------------------------



    // 4동률중 3동률의 처리=1=========[3-111]======================================
    if(no_9 == 1 && no_3 ==3){
     // alert("5동률 [333-1-0] 루틴 도착");
     for ( var k = 0 ; k < 4 ; k++ ){
       if(arr_wp[k]==3) {
         arr_s431.push(sg_arr[i][k]);
       }
       if(arr_wp[k]==9) {
         sg_arr[i][k] = sg_arr[i][k] + 100000000000;
         f_arr2.push(sg_arr[i][k]);
       }
     }; // end of for k


    // 4동률중 3동률의 처리
    if(arr_s431.length == 3){
    var arr_id = [];
    var arr_each = [];
    var arr_wp = [];
    var arr_ratio = [];
    // arr_each[0] = new Array;
    // arr_each[1] = new Array;
    // arr_each[2] = new Array;
    for ( var j = 0 ; j < 3 ; j++ ){
      arr_id.push(arr_s431[j]%10);
      arr_each[j] = new Array;
    }; // end of for j

    for ( var k = 0 ; k < 3 ; k++ ){
              // 3명 상대 각자의 득실 세트 산출 ok
       var fg1 = flag(arr_id[(k)%3], arr_id[(k+1)%3]);
       var fg2 = flag(arr_id[(k)%3], arr_id[(k+2)%3]);
       var ea_wp = 0;
       arr_each[k][0] = ( Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
       arr_each[k][1] = ( Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
             // 3명 비교하여 상대승점 계산
          for ( var l = 0 ; l < 2 ; l++ ){
            var fg = flag(arr_id[(k)%3], arr_id[(k+l+1)%3]);
            if(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg] > arr2[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg]){
              ea_wp = ea_wp + winpoint;
              // // alert("ea_wp="+ea_wp);
            };//end of if

          }; //end of for l
          arr_each[k][3]=(ea_wp);
          arr_wp.push(ea_wp); // ok
          arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
          arr_ratio.push(arr_each[k][4]); //ok
    };// end of for k

      // 3명간 비교하여 승점이 다른 경우 처리 루틴
    if(Math.max.apply(0, arr_wp) == 6){
         // alert( "승점이 다르다");
        for ( var j = 0 ; j < 3 ; j++ ){
            if(arr_each[j][3] == 6){
              //arr_s431[j] = arr_s431[j] + 200000000000 + 100000000000*flag_s3;
              arr_s431[j] = arr_s431[j] + 200000000000;
              f_arr2.push(arr_s431[j]);
            } else if(arr_each[j][3] == 3){
              //arr_s431[j] = arr_s431[j] + 300000000000 + 100000000000*flag_s3;
              arr_s431[j] = arr_s431[j] + 300000000000;
              f_arr2.push(arr_s431[j]);
            }; // end else if
              //arr_s431[j] = arr_s431[j] + 400000000000 + 100000000000*flag_s3;
              arr_s431[j] = arr_s431[j] + 400000000000;
              f_arr2.push(arr_s431[j]);
        }; // end for j
    } else {
        // 3명간 비교시 승률이 같을때 ... 득실률 비교 루틴
            arr_ratio.sort(function(a,b){// 내림차순
               return b-a;     // 11, 10, 4, 3, 2, 1
            });

        if(arr_ratio[0] == arr_ratio[1]){
            for ( var j = 0 ; j < 3 ; j++ ){
              arr_s431[j] = arr_s431[j] + 900000000000;
              f_arr2.push(arr_s431[j]);
              // alert('5-3득실에 의한 순위결정 실패!!!!');
            }; // end of for j
        } else {
          for ( var j = 0 ; j < 3 ; j++ ){
              if(arr_each[j][4] == arr_ratio[0]){
                arr_s431[j] = arr_s431[j] + 400000000000;
                f_arr2.push(arr_s431[j]);
              } else if(arr_each[j][4] == arr_ratio[1]){
                arr_s431[j] = arr_s431[j] + 300000000000;
                f_arr2.push(arr_s431[j]);
              } else if(arr_each[j][4] == arr_ratio[2]){
                arr_s431[j] = arr_s431[j] + 400000000000;
                f_arr2.push(arr_s431[j]);
              };
          }; // end for j
        };// end of if ratio
    }; // end of if max
    }; // end of if length=5-3 루틴2 3-222-1에서 3동률 처리왼료
    }; // end of 5-3 if  999-3-0

     // 4-3 처리루틴2  ################ [222-0] #######ok#######################
     if(no_6 == 3 && no_0 == 1){
       // alert("5동률 3-222-1 루틴 도착"+arr_wp[3])
      for ( var k = 0 ; k < 5 ; k++ ){
        if(arr_wp[k]==6) {
          arr_s432.push(sg_arr[i][k]);
        }
        if(arr_wp[k]==0) {
          sg_arr[i][k] = sg_arr[i][k] + 400000000000;
          f_arr2.push(sg_arr[i][k]);
        }
      }; // end of for k


     // 4동률중 3동률의 처리
     if(arr_s432.length == 3){
     var arr_id = [];
     var arr_each = [];
     var arr_wp = [];
     var arr_ratio = [];
     for ( var j = 0 ; j < 3 ; j++ ){
       arr_id.push(arr_s432[j]%10);
       arr_each[j] = new Array;
     }; // end of for j

     for ( var k = 0 ; k < 3 ; k++ ){
               // 3명 상대 각자의 득실 세트 산출 ok
        var fg1 = flag(arr_id[(k)%3], arr_id[(k+1)%3]);
        var fg2 = flag(arr_id[(k)%3], arr_id[(k+2)%3]);
        var ea_wp = 0;
        arr_each[k][0] = ( Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
        arr_each[k][1] = ( Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
              // 3명 비교하여 상대승점 계산
           for ( var l = 0 ; l < 2 ; l++ ){
             var fg = flag(arr_id[(k)%3], arr_id[(k+l+1)%3]);
             if(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg] > arr2[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg]){
               ea_wp = ea_wp + winpoint;
               // // alert("ea_wp="+ea_wp);
             };//end of if

           }; //end of for l
           arr_each[k][3]=(ea_wp);
           arr_wp.push(ea_wp); // ok
           arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
           arr_ratio.push(arr_each[k][4]); //ok
     };// end of for k

       // 3명간 비교하여 승점이 다른 경우 처리 루틴
     if(Math.max.apply(0, arr_wp) == 6){
          // alert( "승점이 다르다");
         for ( var j = 0 ; j < 3 ; j++ ){
             if(arr_each[j][3] == 6){
               //arr_s432[j] = arr_s432[j] + 200000000000 + 100000000000*flag_s3;
               arr_s432[j] = arr_s432[j] + 100000000000;
               f_arr2.push(arr_s432[j]);
             } else if(arr_each[j][3] == 3){
               //arr_s432[j] = arr_s432[j] + 300000000000 + 100000000000*flag_s3;
               arr_s432[j] = arr_s432[j] + 200000000000;
               f_arr2.push(arr_s432[j]);
             }; // end else if
               //arr_s432[j] = arr_s432[j] + 400000000000 + 100000000000*flag_s3;
               arr_s432[j] = arr_s432[j] + 300000000000;
               f_arr2.push(arr_s432[j]);
         }; // end for j
     } else {
         // 3명간 비교시 승률이 같을때 ... 득실률 비교 루틴
             arr_ratio.sort(function(a,b){// 내림차순
                return b-a;     // 11, 10, 4, 3, 2, 1
             });
         if(arr_ratio[0] == arr_ratio[1]){
             for ( var j = 0 ; j < 3 ; j++ ){
               arr_s432[j] = arr_s432[j] + 900000000000;
               f_arr2.push(arr_s432[j]);
               // alert('5-3득실에 의한 순위결정 실패!!!!');
             }; // end of for j
         } else {
           for ( var j = 0 ; j < 3 ; j++ ){
               if(arr_each[j][4] == arr_ratio[0]){
                 arr_s432[j] = arr_s432[j] + 100000000000;
                 f_arr2.push(arr_s432[j]);
               } else if(arr_each[j][4] == arr_ratio[1]){
                 arr_s432[j] = arr_s432[j] + 200000000000;
                 f_arr2.push(arr_s432[j]);
               } else if(arr_each[j][4] == arr_ratio[2]){
                 arr_s432[j] = arr_s432[j] + 300000000000;
                 f_arr2.push(arr_s432[j]);
               };
           }; // end for j
         };// end of if ratio
     }; // end of if max

    }; // end of if length=5-3 루틴2 3-222-1에서 3동률 처리왼료
    }; // end of if length=4-3

    // 2-2 상황처리 =====================[2211]-===========================
    if(no_6 == 2 && no_3 ==2){
    for ( var k = 0 ; k < 4 ; k++ ){
    if(arr_wp[k]==6) {
      arr_hs2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==3) {
      arr_ls2.push(sg_arr[i][k]);
    }  // end of if 3wins-top-who
    }; // end of for k

    var a= arr_hs2[0]%10;
    var b= arr_hs2[1]%10;
    var fg = flag(a,b);
    var a_diff = diff[a*np+b+fg];
     if(a_diff > 0){
       arr_hs2[0] = arr_hs2[0] + 100000000000;
       arr_hs2[1] = arr_hs2[1] + 200000000000;
       f_arr2.push(arr_hs2[0]);
       f_arr2.push(arr_hs2[1]);
     } else {
       arr_hs2[0] = arr_hs2[0] + 200000000000;
       arr_hs2[1] = arr_hs2[1] + 100000000000;
       f_arr2.push(arr_hs2[0]);
       f_arr2.push(arr_hs2[1]);
     };

     var a= arr_ls2[0]%10;
     var b= arr_ls2[1]%10;
     var fg = flag(a,b);
     var a_diff = diff[a*np+b+fg];
        if(a_diff > 0){
          arr_ls2[0] = arr_ls2[0] + 300000000000;
          arr_ls2[1] = arr_ls2[1] + 400000000000;
          f_arr2.push(arr_ls2[0]);
          f_arr2.push(arr_ls2[1]);
        } else {
          arr_ls2[0] = arr_ls2[0] + 400000000000;
          arr_ls2[1] = arr_ls2[1] + 300000000000;
          f_arr2.push(arr_ls2[0]);
          f_arr2.push(arr_ls2[1]);
        };

    }; // end of if =[2211]-==

    // 2-2 상황처리 =====================[3300]-====================
    if(no_9 == 2 && no_0 ==2){
    for ( var k = 0 ; k < 4 ; k++ ){
    if(arr_wp[k]==9) {
      arr_hs2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==9) {
      arr_ls2.push(sg_arr[i][k]);
    } // end of if 3wins-top-who
    }; // end of for k

    var a= arr_hs2[0]%10;
    var b= arr_hs2[1]%10;
    var fg = flag(a,b);
    var a_diff = diff[a*np+b+fg];
     if(a_diff > 0){
       arr_hs2[0] = arr_hs2[0] + 100000000000;
       arr_hs2[1] = arr_hs2[1] + 200000000000;
       f_arr2.push(arr_hs2[0]);
       f_arr2.push(arr_hs2[1]);
     } else {
       arr_hs2[0] = arr_hs2[0] + 200000000000;
       arr_hs2[1] = arr_hs2[1] + 100000000000;
       f_arr2.push(arr_hs2[0]);
       f_arr2.push(arr_hs2[1]);
     };

     var a= arr_ls2[0]%10;
     var b= arr_ls2[1]%10;
     var fg = flag(a,b);
     var a_diff = diff[a*np+b+fg];
        if(a_diff > 0){
          arr_ls2[0] = arr_ls2[0] + 300000000000;
          arr_ls2[1] = arr_ls2[1] + 400000000000;
          f_arr2.push(arr_ls2[0]);
          f_arr2.push(arr_ls2[1]);
        } else {
          arr_ls2[0] = arr_ls2[0] + 400000000000;
          arr_ls2[1] = arr_ls2[1] + 300000000000;
          f_arr2.push(arr_ls2[0]);
          f_arr2.push(arr_ls2[1]);
        };

    }; // end of if 2wins [33-00]

    if(no_0 ==4){
        for ( var j = 0 ; j < 4 ; j++ ){
          sg_arr4[j] = sg_arr4[j] + 900000000000;
          f_arr2.push(sg_arr4[j]);
        };
    }; // end of if 4명 승점=0
  }; // end of if length=4

    // >>>>>>>>> 승점동률5 처리루틴 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    if(sg_arr[i].length == 5){
    // alert("5동률도착");
    //  // alert("5동률도착" +sg_arr[i][4]);
    var sg_arr5 = [];
    for ( var j = 0 ; j < 5 ; j++ ){
    sg_arr5.push(sg_arr[i][j]);
    };
    var arr_id = [];
    var arr_each = [];
    var arr_wp = [];
    var arr_ratio = [];
    var arr_ratio_id = [];
    var arr_s531 = [];
    var arr_s532 = [];
    var flag_s3 = 0;
    arr_each[0] = new Array;
    arr_each[1] = new Array;
    arr_each[2] = new Array;
    arr_each[3] = new Array;
    arr_each[4] = new Array;
    var arr_51hs2 = [];
    var arr_51ls2 = [];
    var arr_52hs2 = [];
    var arr_52ls2 = [];
    var wp_total5 =0;
    for ( var j = 0 ; j < 5 ; j++ ){
    arr_id.push(sg_arr5[j]%100);
    }; // end of for j

    // 5명간 승점 득실 계산 ********************ok***********************
    for ( var k = 0 ; k < 5 ; k++ ){
            // 5명 상대 각자의 득실 세트 산출 ok
     var fg1 = flag(arr_id[(k)%5], arr_id[(k+1)%5]);
     var fg2 = flag(arr_id[(k)%5], arr_id[(k+2)%5]);
     var fg3 = flag(arr_id[(k)%5], arr_id[(k+3)%5]);
     var fg4 = flag(arr_id[(k)%5], arr_id[(k+4)%5]);
     var ea_wp = 0;
     arr_each[k][0] = ( Number(arr1[(arr_id[(k)%5]*np)+(arr_id[(k+1)%5])+fg1]) + Number(arr1[(arr_id[(k)%5]*np)+(arr_id[(k+2)%5])+fg2])
                        + Number(arr1[(arr_id[(k)%5]*np)+(arr_id[(k+3)%5])+fg3]) + Number(arr1[(arr_id[(k)%5]*np)+(arr_id[(k+4)%5])+fg4]));
     arr_each[k][1] = ( Number(arr2[(arr_id[(k)%5]*np)+(arr_id[(k+1)%5])+fg1]) + Number(arr2[(arr_id[(k)%5]*np)+(arr_id[(k+2)%5])+fg2])
                        + Number(arr2[(arr_id[(k)%5]*np)+(arr_id[(k+3)%5])+fg3]) + Number(arr2[(arr_id[(k)%5]*np)+(arr_id[(k+4)%5])+fg4]));
           // 5명 비교하여 상대승점 계산
        for ( var l = 0 ; l < 4 ; l++ ){
          var fg = flag(arr_id[(k)%5], arr_id[(k+l+1)%5]);
          if(arr1[(arr_id[(k)%5]*np)+(arr_id[(k+l+1)%5])+fg] > arr2[(arr_id[(k)%5]*np)+(arr_id[(k+l+1)%5])+fg]){
            ea_wp = ea_wp + winpoint;
          };//end of if

        }; //end of for l
        arr_each[k][3]=(ea_wp);
        arr_wp.push(ea_wp); // ok
        arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
        arr_ratio.push(arr_each[k][4]);
        arr_ratio_id.push((parseInt(arr_ratio[k]*1000))*100+ arr_id[k]); //ok
    };// end of for k

    for ( var k1 = 0 ; k1 < arr_ratio.length ; k1++ ){
      if(isNaN(arr_wp[k1])){
         arr_wp[k1] = 0;
      }
      if(isNaN(arr_ratio[k1])){
         arr_ratio[k1] = 0;
      }
    };

    var no_12 = 0;
    var no_9 = 0;
    var no_6 = 0;
    var no_3 = 0;
    var no_0 = 0;
    var no_ratio1 = 0;
    // 승점이 같은것의 갯수 기록
    for ( var k = 0 ; k < 5 ; k++ ){
    if(arr_wp[k]==12){
    no_12 = no_12+1;
    }
    if(arr_wp[k]==9){
    no_9 = no_9+1;
    }
    if(arr_wp[k]==6){
    no_6 = no_6+1;
    }
    if(arr_wp[k]==3){
    no_3 = no_3+1;
    }
    if(arr_wp[k]==0){
    no_0 = no_0+1;
    }
    if(parseInt(arr_ratio_id[k]/100) == 1000){
    no_ratio1 = no_ratio1+1;
    }
    }; // end of for k 승점이 같은것의 갯수 기록

    // 게임중 상대전적 미완료시 처리
    for ( var k2 = 0 ; k2 < arr_wp.length ; k2++ ){
      wp_total5 = wp_total5+ arr_wp[k2];
    };

   if(wp_total5 < arr_wp.length*3){
       for ( var k3 = 0 ; k3 < arr_wp.length ; k3++ ){
         sg_arr5[k3] = sg_arr5[k3] + 800000000000
         f_arr2.push(sg_arr5[k3]);
       };
   }; // end of if

    // 5명간 비교시 승점이 다 다른경우 ========[4-3-2-1-0]==============================
    if(no_12 == 1){
     // alert("5동률시 승점이 모두 다른경우 루틴 도착");
    for ( var j = 0 ; j < 5 ; j++ ){
    if(arr_each[j][3] == 12){
    sg_arr5[j] = sg_arr5[j] + 100000000000;
    f_arr2.push(sg_arr5[j]);
    }
    if(arr_each[j][3] == 9){
    sg_arr5[j] = sg_arr5[j] + 200000000000;
    f_arr2.push(sg_arr5[j]);
    }
    if(arr_each[j][3] == 6){
    sg_arr5[j] = sg_arr5[j] + 300000000000;
    f_arr2.push(sg_arr5[j]);
    }
    if(arr_each[j][3] == 3){
    sg_arr5[j] = sg_arr5[j] + 400000000000;
    f_arr2.push(sg_arr5[j]);
    }
    if(arr_each[j][3] == 0){
    sg_arr5[j] = sg_arr5[j] + 500000000000;
    f_arr2.push(sg_arr5[j]);
    } // end of 5-if
    }; // end of for roop j
    }; // end of if no_**===[4-3-2-1-0]====처리 완료

    var arr_s55 = []; // 득실율 정수화 한후 id를 붙여서 정렬
    // 다섯명의 승점이 모두 같은 경우 처리 루틴 ###########[22222]############################
    if(no_6 == 5){
    arr_ratio_id.sort(function(a,b){// 내림차순
    return b-a;
    }); // end sort
    if(no_ratio1 == 0){
    var a= parseInt(arr_ratio_id[0]/100);
    var b= parseInt(arr_ratio_id[1]/100);
    var c= parseInt(arr_ratio_id[2]/100);
    var d= parseInt(arr_ratio_id[3]/100);
    var e= parseInt(arr_ratio_id[4]/100);
    var ff = (a-b)*(b-c)*(c-d)*(d-e);
      if(ff== 0){
      }; // end if
      if(ff != 0){
        for ( var k = 0 ; k < 5 ; k++ ){
           var id = arr_ratio_id[k]%100;
           var fdata = sg_arr5[id] + (k+1)*100000000000;
           f_arr2.push(fdata);
        }; // end for k
      }; // end of if
    } // end of if no_ratio1 ==0

    var index_ratio1 = 0 ;
    if(no_ratio1 ==1){
      for ( var k = 0 ; k < 5 ; k++ ){
         if(parseInt(arr_ratio_id[k]/100) == 1000){
           var index_ratio1 = k;
         }
      }; // end for k

      if(index_ratio1 != 2){
        // alert("총5승점동-각5승점동--득실계산 no_ratio1=1 상황 에러발생 ");
      };
      if(index_ratio1 == 2){
          if(parseInt(arr_ratio_id[0]/100) == parseInt(arr_ratio_id[1]/100)){
             // alert("총5승점동-각5승점동--득실계산 no_ratio1=1 상위2명 득실같음");
             var fdata = sg_arr5[0] + 100000000000;
             f_arr2.push(fdata);
             var fdata = sg_arr5[1] + 100000000000;
             f_arr2.push(fdata);
          }

          if(parseInt(arr_ratio_id[0]/100) != parseInt(arr_ratio_id[1]/100)){
             var fdata = sg_arr5[0] + 100000000000;
             f_arr2.push(fdata);
             var fdata = sg_arr5[1] + 200000000000;
             f_arr2.push(fdata);
          }
            var fdata = sg_arr5[2] + 300000000000;
            f_arr2.push(fdata);

            if(parseInt(arr_ratio_id[3]/100) == parseInt(arr_ratio_id[4]/100)){
               // alert("총5승점동-각5승점동--득실계산 no_ratio1=1 하위2명(4and5) 득실같음");
               var fdata = sg_arr5[3] + 400000000000;
               f_arr2.push(fdata);
               var fdata = sg_arr5[4] + 400000000000;
               f_arr2.push(fdata);
            }

            if(parseInt(arr_ratio_id[3]/100) != parseInt(arr_ratio_id[4]/100)){
               var fdata = sg_arr5[0] + 400000000000;
               f_arr2.push(fdata);
               var fdata = sg_arr5[1] + 500000000000;
               f_arr2.push(fdata);
            }
      }; // end of if index_ratio1 == 2
    } // end of if no_ratio1 ==1

    if(no_ratio1 == 2){
      for ( var k = 0 ; k < 5 ; k++ ){
         if(parseInt(arr_ratio_id[k]/100) == 1000){
           var index_ratio1 = k;
         }
     }; // end of for k

     if(index_ratio1 == 2){
        // alert("총5승점동-각5승점동--득실계산 no_ratio1=1 2명(2and3) 득실같음");
        var fdata = sg_arr5[0] + 100000000000;
        f_arr2.push(fdata);
        var fdata = sg_arr5[1] + 200000000000;
        f_arr2.push(fdata);
        var fdata = sg_arr5[2] + 200000000000;
        f_arr2.push(fdata);
            if(parseInt(arr_ratio_id[3]/100) == parseInt(arr_ratio_id[4]/100)){
               // alert("총5승점동-각5승점동--득실계산 no_ratio1=2 하위2명(4and5) 득실같음");
               var fdata = sg_arr5[3] + 400000000000;
               f_arr2.push(fdata);
               var fdata = sg_arr5[4] + 400000000000;
               f_arr2.push(fdata);
            }

            if(parseInt(arr_ratio_id[3]/100) != parseInt(arr_ratio_id[4]/100)){
               var fdata = sg_arr5[0] + 400000000000;
               f_arr2.push(fdata);
               var fdata = sg_arr5[1] + 500000000000;
               f_arr2.push(fdata);
            } // end of if 하위2명
     }; //index_ratio1 == 2

     if(index_ratio1 == 3){
        // alert("총5승점동-각5승점동-득실계산 no_ratio1=1 2명(3and4) 득실같음");
        var fdata = sg_arr5[2] + 300000000000;
        f_arr2.push(fdata);
        var fdata = sg_arr5[3] + 300000000000;
        f_arr2.push(fdata);
        var fdata = sg_arr5[4] + 500000000000;
        f_arr2.push(fdata);
            if(parseInt(arr_ratio_id[0]/100) == parseInt(arr_ratio_id[1]/100)){
               // alert("총5승점동-각5승점동-득실계산 no_ratio1=2 상위2명(1and2) 득실같음");
               var fdata = sg_arr5[3] + 100000000000;
               f_arr2.push(fdata);
               var fdata = sg_arr5[4] + 100000000000;
               f_arr2.push(fdata);
            }

            if(parseInt(arr_ratio_id[3]/100) != parseInt(arr_ratio_id[4]/100)){
               var fdata = sg_arr5[0] + 100000000000;
               f_arr2.push(fdata);
               var fdata = sg_arr5[1] + 200000000000;
               f_arr2.push(fdata);
            } // end of if 하위2명
     }; //index_ratio1 == 3

    }; // end of if no_ratio1 ==2

    if(no_ratio1 == 3){
       // alert("총5승점동-각5승점동-득실계산 no_ratio1=1 3명(2-4) 득실같음");
       var fdata = sg_arr5[0] + 100000000000;
       f_arr2.push(fdata);
       var fdata = sg_arr5[1] + 200000000000;
       f_arr2.push(fdata);
       var fdata = sg_arr5[2] + 200000000000;
       f_arr2.push(fdata);
       var fdata = sg_arr5[3] + 200000000000;
       f_arr2.push(fdata);
       var fdata = sg_arr5[4] + 500000000000;
       f_arr2.push(fdata);
    };// end of if no_ratio1 ==3

    if(no_ratio1 == 5){
       // alert("총5승점동-각5승점동-득실계산 no_ratio1=1 5명(2-4) 모두 득실같음");
       for ( var k = 0 ; k < 5 ; k++ ){
         var fdata = sg_arr5[k] + 100000000000;
         f_arr2.push(fdata);
       }; // end of for k
    };// end of if no_ratio1 ==5
    }; // end of if 5-5  5명의 승점이 모두 같은 경우 처리 완료

    // 5-3 처리루틴1 ##################[333-1-0]##############################1
    if(no_9 == 3 && no_3 ==1){
    // alert("5동률 [333-1-0] 루틴 도착");
    for ( var k = 0 ; k < 5 ; k++ ){
    if(arr_wp[k]==9) {
    arr_s531.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==3) {
    sg_arr[i][k] = sg_arr[i][k] + 400000000000;
    f_arr2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==0) {
    sg_arr[i][k] = sg_arr[i][k] + 500000000000;
    f_arr2.push(sg_arr[i][k]);
    }
    }; // end of for k


    // 5동률중 3동률의 처리
    if(arr_s531.length == 3){
    var arr_id = [];
    var arr_each = [];
    var arr_wp = [];
    var arr_ratio = [];
    for ( var j = 0 ; j < 3 ; j++ ){
    arr_id.push(arr_s531[j]%10);
    arr_each[j] = new Array;
    }; // end of for j

    for ( var k = 0 ; k < 3 ; k++ ){
         // 3명 상대 각자의 득실 세트 산출 ok
    var fg1 = flag(arr_id[(k)%3], arr_id[(k+1)%3]);
    var fg2 = flag(arr_id[(k)%3], arr_id[(k+2)%3]);
    var ea_wp = 0;
    arr_each[k][0] = ( Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
    arr_each[k][1] = ( Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
        // 3명 비교하여 상대승점 계산
     for ( var l = 0 ; l < 2 ; l++ ){
       var fg = flag(arr_id[(k)%3], arr_id[(k+l+1)%3]);
       if(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg] > arr2[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg]){
         ea_wp = ea_wp + winpoint;
       };//end of if

     }; //end of for l
     arr_each[k][3]=(ea_wp);
     arr_wp.push(ea_wp); // ok
     arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
     arr_ratio.push(arr_each[k][4]); //ok
    };// end of for k

    // 3명간 비교하여 승점이 다른 경우 처리 루틴
    if(Math.max.apply(0, arr_wp) == 6){
    // alert( "승점이 다르다");
    for ( var j = 0 ; j < 3 ; j++ ){
       if(arr_each[j][3] == 6){
         //arr_s531[j] = arr_s531[j] + 200000000000 + 100000000000*flag_s3;
         arr_s531[j] = arr_s531[j] + 100000000000;
         f_arr2.push(arr_s531[j]);
       } else if(arr_each[j][3] == 3){
         //arr_s531[j] = arr_s531[j] + 300000000000 + 100000000000*flag_s3;
         arr_s531[j] = arr_s531[j] + 200000000000;
         f_arr2.push(arr_s531[j]);
       }; // end else if
         //arr_s531[j] = arr_s531[j] + 400000000000 + 100000000000*flag_s3;
         arr_s531[j] = arr_s531[j] + 300000000000;
         f_arr2.push(arr_s531[j]);
    }; // end for j
    } else {
    // 3명간 비교시 승률이 같을때 ... 득실률 비교 루틴
       arr_ratio.sort(function(a,b){// 내림차순
          return b-a;     // 11, 10, 4, 3, 2, 1
       });

    if(arr_ratio[0] == arr_ratio[1]){
       for ( var j = 0 ; j < 3 ; j++ ){
         arr_s531[j] = arr_s531[j] + 900000000000;
         f_arr2.push(arr_s531[j]);
       }; // end of for j
    } else {
     for ( var j = 0 ; j < 3 ; j++ ){
         if(arr_each[j][4] == arr_ratio[0]){
           arr_s531[j] = arr_s531[j] + 100000000000;
           f_arr2.push(arr_s531[j]);
         } else if(arr_each[j][4] == arr_ratio[1]){
           arr_s531[j] = arr_s531[j] + 200000000000;
           f_arr2.push(arr_s531[j]);
         } else if(arr_each[j][4] == arr_ratio[2]){
           arr_s531[j] = arr_s531[j] + 300000000000;
           f_arr2.push(arr_s531[j]);
         };
     }; // end for j
    };// end of if ratio
    }; // end of if max
    }; // end of if length=5-3 루틴2 3-222-1에서 3동률 처리왼료
    }; // end of 5-3 if  999-3-0

    // 5-3 처리루틴2  ################ [3-222-1] #######ok#######################
    if(no_6 == 3 && no_9 == 1){
    // alert("5동률 3-222-1 루틴 도착"+arr_wp[3])
    for ( var k = 0 ; k < 5 ; k++ ){
    if(arr_wp[k]==6) {
     arr_s532.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==9) {
     sg_arr[i][k] = sg_arr[i][k] + 100000000000;
     f_arr2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==3) {
     sg_arr[i][k] = sg_arr[i][k] + 500000000000;
     f_arr2.push(sg_arr[i][k]);
    }
    }; // end of for k


    // 5동률중 3동률의 처리
    if(arr_s532.length == 3){
    var arr_id = [];
    var arr_each = [];
    var arr_wp = [];
    var arr_ratio = [];
    for ( var j = 0 ; j < 3 ; j++ ){
    arr_id.push(arr_s532[j]%10);
    arr_each[j] = new Array;
    }; // end of for j

    for ( var k = 0 ; k < 3 ; k++ ){
          // 3명 상대 각자의 득실 세트 산출 ok
    var fg1 = flag(arr_id[(k)%3], arr_id[(k+1)%3]);
    var fg2 = flag(arr_id[(k)%3], arr_id[(k+2)%3]);
    var ea_wp = 0;
    arr_each[k][0] = ( Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
    arr_each[k][1] = ( Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+1)%3])+fg1]) + Number(arr2[(arr_id[(k)%3]*np)+(arr_id[(k+2)%3])+fg2]));
         // 3명 비교하여 상대승점 계산
      for ( var l = 0 ; l < 2 ; l++ ){
        var fg = flag(arr_id[(k)%3], arr_id[(k+l+1)%3]);
        if(arr1[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg] > arr2[(arr_id[(k)%3]*np)+(arr_id[(k+l+1)%3])+fg]){
          ea_wp = ea_wp + winpoint;
          // // alert("ea_wp="+ea_wp);
        };//end of if

      }; //end of for l
      arr_each[k][3]=(ea_wp);
      arr_wp.push(ea_wp); // ok
      arr_each[k][4] = (arr_each[k][0]/arr_each[k][1]);
      arr_ratio.push(arr_each[k][4]); //ok
    };// end of for k

    // 3명간 비교하여 승점이 다른 경우 처리 루틴
    if(Math.max.apply(0, arr_wp) == 6){
     // alert( "승점이 다르다");
    for ( var j = 0 ; j < 3 ; j++ ){
        if(arr_each[j][3] == 6){
          arr_s532[j] = arr_s532[j] + 200000000000 + 100000000000*flag_s3;
          f_arr2.push(arr_s532[j]);
        } else if(arr_each[j][3] == 3){
          arr_s532[j] = arr_s532[j] + 300000000000 + 100000000000*flag_s3;
          f_arr2.push(arr_s532[j]);
        }; // end else if
          arr_s532[j] = arr_s532[j] + 400000000000 + 100000000000*flag_s3;
          f_arr2.push(arr_s532[j]);
    }; // end for j
    } else {
    // 3명간 비교시 승률이 같을때 ... 득실률 비교 루틴
        arr_ratio.sort(function(a,b){// 내림차순
           return b-a;     // 11, 10, 4, 3, 2, 1
        });

    if(arr_ratio[0] == arr_ratio[1]){
        for ( var j = 0 ; j < 3 ; j++ ){
          arr_s532[j] = arr_s532[j] + 900000000000;
          f_arr2.push(arr_s532[j]);
          // alert('5-3득실에 의한 순위결정 실패!!!!');
        }; // end of for j
    } else {
      for ( var j = 0 ; j < 3 ; j++ ){
          if(arr_each[j][4] == arr_ratio[0]){
            arr_s532[j] = arr_s532[j] + 200000000000;
            f_arr2.push(arr_s532[j]);
          } else if(arr_each[j][4] == arr_ratio[1]){
            arr_s532[j] = arr_s532[j] + 300000000000;
            f_arr2.push(arr_s532[j]);
          } else if(arr_each[j][4] == arr_ratio[2]){
            arr_s532[j] = arr_s532[j] + 400000000000;
            f_arr2.push(arr_s532[j]);
          };
      }; // end for j
    };// end of if ratio
    }; // end of if max

    }; // end of if length=5-3 루틴2 3-222-1에서 3동률 처리왼료
    f_arr2.sort(function(a,b){// 내림차순
        return a-b;
    }); // end of sort
    };   // 5-3 처리루틴2 3-222-1 끝 ---------------------------------------------

    // 5동 2-2 처리 1 ##############[33-22-0]###############################
    if(no_9 == 2 && no_6 ==2){
    for ( var k = 0 ; k < 5 ; k++ ){
    if(arr_wp[k]==9) {
      arr_51hs2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==6) {
      arr_51ls2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==0) {
      sg_arr[i][k] = sg_arr[i][k] + 500000000000;
      f_arr2.push(sg_arr[i][k]);
    }; // end of if
    }; // end of for k

    var a= arr_51hs2[0]%10;
    var b= arr_51hs2[1]%10;
    var fg = flag(a,b);
    var a_diff = diff[a*np+b+fg];
     if(a_diff > 0){
       arr_51hs2[0] = arr_51hs2[0] + 100000000000;
       arr_51hs2[1] = arr_51hs2[1] + 200000000000;
       f_arr2.push(arr_51hs2[0]);
       f_arr2.push(arr_51hs2[1]);
     } else {
       arr_51hs2[0] = arr_51hs2[0] + 200000000000;
       arr_51hs2[1] = arr_51hs2[1] + 100000000000;
       f_arr2.push(arr_51hs2[0]);
       f_arr2.push(arr_51hs2[1]);
     };

     var a= arr_51ls2[0]%10;
     var b= arr_51ls2[1]%10;
     var fg = flag(a,b);
     var a_diff = diff[a*np+b+fg];
        if(a_diff > 0){
          arr_51ls2[0] = arr_51ls2[0] + 300000000000;
          arr_51ls2[1] = arr_51ls2[1] + 400000000000;
          f_arr2.push(arr_51ls2[0]);
          f_arr2.push(arr_51ls2[1]);
        } else {
          arr_51ls2[0] = arr_51ls2[0] + 400000000000;
          arr_51ls2[1] = arr_51ls2[1] + 300000000000;
          f_arr2.push(arr_51ls2[0]);
          f_arr2.push(arr_51ls2[1]);
        };
    }; // end of if   #[33-22-0]#


    // 5동 2-2 처리 2 #############################[33-2-11]####################
    if(no_9 == 2 && no_3 ==2){
    // alert("5동률도착 33-2-11");
    for ( var k = 0 ; k < 5 ; k++ ){
    if(arr_wp[k]==9) {
      arr_52hs2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==3) {
      arr_52ls2.push(sg_arr[i][k]);
    }
    if(arr_wp[k]==6) {
      sg_arr[i][k] = sg_arr[i][k] + 300000000000;
      f_arr2.push(sg_arr[i][k]);
    }; // end of if
    }; // end of for k

    var a= arr_52hs2[0]%10;
    var b= arr_52hs2[1]%10;
    var fg = flag(a,b);
    var a_diff = diff[a*np+b+fg];
     if(a_diff > 0){
       arr_52hs2[0] = arr_52hs2[0] + 100000000000;
       arr_52hs2[1] = arr_52hs2[1] + 200000000000;
       f_arr2.push(arr_52hs2[0]);
       f_arr2.push(arr_52hs2[1]);
     } else {
       arr_52hs2[0] = arr_52hs2[0] + 200000000000;
       arr_52hs2[1] = arr_52hs2[1] + 100000000000;
       f_arr2.push(arr_52hs2[0]);
       f_arr2.push(arr_52hs2[1]);
     };

     var a= arr_52ls2[0]%10;
     var b= arr_52ls2[1]%10;
     var fg = flag(a,b);
     var a_diff = diff[a*np+b+fg];
        if(a_diff > 0){
          arr_52ls2[0] = arr_52ls2[0] + 300000000000;
          arr_52ls2[1] = arr_52ls2[1] + 400000000000;
          f_arr2.push(arr_52ls2[0]);
          f_arr2.push(arr_52ls2[1]);
        } else {
          arr_52ls2[0] = arr_52ls2[0] + 400000000000;
          arr_52ls2[1] = arr_52ls2[1] + 300000000000;
          f_arr2.push(arr_52ls2[0]);
          f_arr2.push(arr_52ls2[1]);
        };
    }; // end of if #[33-2-11]#

    if(no_0 ==5){
        for ( var j = 0 ; j < 5 ; j++ ){
          sg_arr5[j] = sg_arr5[j] + 900000000000;
          f_arr2.push(sg_arr5[j]);
        };
    }; // end of if 4명 승점=0

  }; // end of if length=5 #############################################<<<<<

  // data값이 5명 이상 없을 때 ####################################################
    if(sg_arr[i].length > 5){
      var max = sg_arr[i].length;
      var sg_arrX = [];
      var arr_ratio = [];
      var arr_wp = [];
      for ( var j = 0 ; j < max ; j++ ){
      sg_arrX.push(sg_arr[i][j]);
      };
      for ( var l6 = 0 ; l6 < max ; l6++ ){
        if(isNaN(arr_wp[l6])){
           arr_wp[l6] = 0;
        }
        if(isNaN(arr_ratio[l6])){
           arr_ratio[l6] = 0;
        }
      }; // end of for

      for ( var j = 0 ; j < max ; j++ ){
        sg_arrX[j] = sg_arrX[j] + 800000000000;
        f_arr2.push(sg_arrX[j]);
      };

    }; // end of if data값이 5명 이상 없을 때

    function flag(a,b){
    var f=0;
       if(a > b){
         f=0;
         return f;
       };
        f=-1;
        return f;
    }; // enf of funtion


        f_arr2.sort(function(a,b){// 내림차순
        return a-b;
        });
    }; // end of 동점처리루틴

    var rdata = {
      gName : gname,
      gnamePlus : group_name,
      rankData : f_arr2
    };

      var data = new md_gRank;
      data.rid = fid;
      data.group_rank = rdata;
      md_gRank.findOneAndUpdate({rid: data.rid},
        {group_rank:rdata},
        {new: true, upsert: true, setDefaultsOnInsert: true},
        function(error, md_gRanks) {
          if(error){
              console.log("Something wrong when updating data!");
          }
    });
    var gname_id = Number(strArr[1]);
    var gname_type = strArr[0];
    var group_name1 = ['A조','B조','C조','D조','E조','F조'];
    var gname;
    var group_name2 = ['1그룹','2그룹','3그룹','4그룹','5그룹','6그룹','7그룹','8그룹'];
    var g_id = gname_id%10;
    // console.log("gname_type=" + gname_type);
      if(gname_type == 'sm'){
        for ( var sn = 0 ; sn < 6 ; sn++ ){
            if(g_id == sn){
              gname = group_name1[sn]
            };
        };
     };
    if(gname_type == 'ts' || gname_type == 'td'){
        for ( var sn = 0 ; sn < 8 ; sn++ ){
            if(g_id == sn){
              gname = group_name2[sn]
            };
       };
    };
      // var user = req.user;
      // console.log("user=" + user);
      res.render("gbrackets/vw_eachgroup", {sdata:ts,  gname:gname, gameID:gameID, user:req.user});
    }); // end of findOneAndUpdate  router.post('/:id', function(req,res){

    }
    catch(err) {    
      return res.redirect("rt_gbrackets_v2");
    };

}); // end of router post/id



router.get("/view/:id", isLoggedIn, function(req, res){
  var tid = 0;
  var gameID = req.params.id;
  var strArr = gameID.split('-');
  // if(req.params.id == 'A'){
  //   tid = 10;
  // }
  // if(req.params.id == 'B'){
  //   tid = 11;
  // }
  // if(req.params.id == 'C'){
  //   tid = 12;
  // }
  // if(req.params.id == 'D'){
  //   tid = 13;
  // }
  // if(req.params.id == 'E'){
  //   tid = 14;
  // }
  // if(req.params.id == 'F'){
  //   tid = 15;
  // }
  tid = strArr[1];

  gbkt_each.find({gid:tid}, {_id:0, group_each:1}, function(err, gbkt_eachs){
    if(err) return res.status(500).send({error: 'database find failure'});
    var ts;
    ts = gbkt_eachs[0].group_each;
    //var gname = Number(strArr[1]);
    var gname_id = Number(strArr[1]);
    var gname_type = strArr[0];
    var group_name1 = ['A조','B조','C조','D조','E조','F조'];
    var gname;
    var group_name2 = ['1그룹','2그룹','3그룹','4그룹','5그룹','6그룹','7그룹','8그룹'];
    var g_id = gname_id%10;
    // console.log("gname_type=" + gname_type);
      if(gname_type == 'sm'){
        for ( var sn = 0 ; sn < 6 ; sn++ ){
            if(g_id == sn){
              gname = group_name1[sn]
            };
        };
     };
    if(gname_type == 'ts' || gname_type == 'td'){
        for ( var sn = 0 ; sn < 8 ; sn++ ){
            if(g_id == sn){
              gname = group_name2[sn]
            };
       };
    };
     //var user = req.user;
    // console.log("view user=" + user);
    res.render("gbrackets/vw_eachgroup", {sdata:ts,  gname:gname, gameID:gameID, user:req.user});
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

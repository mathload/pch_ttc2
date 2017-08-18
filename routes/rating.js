var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var gbook     = require('../models/gbook');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var memberList     = require('../models/md_memberList');

// index
// router.get("/", isLoggedIn, function(req, res){
  router.get("/", function(req, res){
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

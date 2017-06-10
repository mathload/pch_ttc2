var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var gbook     = require('../models/gbook');
var Counter  = require('../models/Counter');
var async    = require('async');
var User     = require('../models/User');
var memberList     = require('../models/md_memberList');

// index
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

// new
router.get('/new', isLoggedIn, function(req,res){
  res.render("gbooks/new", {user:req.user});
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

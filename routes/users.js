var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var User     = require('../models/User');
var async    = require('async');
var util     = require("../util");

// new
router.get('/new', function(req,res){
  res.render('users/new', {
                            formData: req.flash('formData')[0],
                            emailError: req.flash('emailError')[0],
                            usernameError: req.flash('usernameError')[0],
                            passwordError: req.flash('passwordError')[0]
                          }
  );
});

// create
router.post('/', checkUserRegValidation, function(req,res,next){
  User.create(req.body.user, function (err,user) {
    if(err) return res.json({success:false, message:err});
    req.flash("loginMessage","Thank you for registration!");
    res.redirect('/login');
  });
});

// show
// router.get('/:id', isLoggedIn, function(req,res){
//     User.findById(req.params.id, function (err,user) {
//       if(err) return res.json({success:false, message:err});
//       res.render("users/show", {user: user});
//     });
// });

// show
router.get("/:username", util.isLoggedin, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render("users/show", {user:user});
  });
});

//edit
// router.get('/:id/edit', util.isLoggedin, function(req,res){
//   if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});
//   User.findById(req.params.id, function (err,user) {
//     if(err) return res.json({success:false, message:err});
//     res.render("users/edit", {
//                               user: user,
//                               formData: req.flash('formData')[0],
//                               emailError: req.flash('emailError')[0],
//                               usernameError: req.flash('usernameError')[0],
//                               passwordError: req.flash('passwordError')[0]
//                              }
//     );
//   });
// });

//edit  checkPermission,
router.get("/:username/edit", util.isLoggedin,  function(req, res){
  var user = req.flash("user")[0];
  var errors = req.flash("errors")[0] || {};
  if(!user){
    User.findOne({username:req.params.username}, function(err, user){
      if(err) return res.json(err);
      res.render("users/edit", { username:req.params.username, user:user, errors:errors });
    });
  } else {
    res.render("users/edit", { username:req.params.username, user:user, errors:errors });
  }
});

//update
// router.put('/:id', isLoggedIn, checkUserRegValidation, function(req,res){
//   if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});
//   User.findById(req.params.id, function (err,user) {
//     if(err) return res.json({success:"false", message:err});
//     if(user.authenticate(req.body.currentPassword)){
//       if(req.body.user.newPassword){
//         req.body.user.password = user.hash(req.body.user.newPassword);
//       }
//       User.findByIdAndUpdate(req.params.id, req.body.user, function (err,user) {
//         if(err) return res.json({success:"false", message:err});
//         res.redirect('/users/'+req.params.id);
//       });
//     } else {
//       req.flash("formData", req.body.user);
//       req.flash("passwordError", "- Invalid password");
//       res.redirect('/users/'+req.params.id+"/edit");
//     }
//   });
// });

// update  checkPermission,
router.put("/:username", util.isLoggedin,  function(req, res, next){
  User.findOne({username:req.params.username})
  .select({password:1})
  .exec(function(err, user){
    if(err) return res.json(err);

    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword? req.body.newPassword : user.password;
    for(var p in req.body){
      user[p] = req.body[p];
    }

    // save updated user
    user.save(function(err, user){
      if(err){
        req.flash("user", req.body);
        req.flash("errors", util.parseError(err));
        return res.redirect("/users/"+req.params.username+"/edit");
      }
      res.redirect("/users/"+req.params.username);
    });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function checkUserRegValidation(req, res, next) {
  var isValid = true;

  async.waterfall(
    [function(callback) {
      User.findOne({username: req.body.user.username, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("usernameError","- This username is already resistered.");
          }
          callback(null, isValid);
        }
      );
    }, function(isValid, callback) {
      User.findOne({username: req.body.user.username, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("usernameError","- This username is already resistered.");
          }
          callback(null, isValid);
        }
      );
    }], function(err, isValid) {
      if(err) return res.json({success:"false", message:err});
      if(isValid){
        return next();
      } else {
        req.flash("formData",req.body.user);
        res.redirect("back");
      }
    }
  );
}

// private functions
function checkPermission(req, res, next){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    if(user._id != req.user.id) return util.noPermission(req, res);

    next();
  });
}

module.exports = router;

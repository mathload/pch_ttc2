var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var dolistSchema = mongoose.Schema({
    dolistid: {type:Number},
    todolist: {type:Array},
    donelist : {type:Array}
    });
var dolist = mongoose.model('dolist',dolistSchema);
module.exports = dolist;

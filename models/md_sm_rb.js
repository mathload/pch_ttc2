var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");
autoIncrement = require('mongoose-auto-increment');

var rbsmSchema = mongoose.Schema({
    matchid: {type:String, required:true, unique:true},
    //rbsmid: {type:Number},
    rbsmplist: {type:Array},
    gameDate: {type:Date, default:Date.now}
    });

var rbsm = mongoose.model('rbsm',rbsmSchema);

module.exports = rbsm;

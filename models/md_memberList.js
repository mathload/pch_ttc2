var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");
autoIncrement = require('mongoose-auto-increment');

var playerRankingSchema = mongoose.Schema({
  // email: {type:String, required:true, unique:true},
  myname: {type:String},
  resisterDate: {type:Date},
  currentDate: {type:Date, default:Date.now},
  grade: {type:String},
  sex: {type:String},
  memberShip: {type:String},
  myBeforeRating : {type:Number},
  myCurrentRating: {type:Number},
  rd: {type:Number},
  vol: {type:Number},
  myScore : {type:Number},
  oppScore : {type:Number},
  oppname: {type:String},
  oppBeforeRating : {type:Number},
  oppCurrentRating: {type:Number},
  no_win: {type:Number},
  no_loss: {type:Number},
  winRate: {type:Number},
});

playerRankingSchema.plugin(autoIncrement.plugin, {
    model: 'memberList',
    field: 'rsId',
    startAt: 1000,
    incrementBy: 1
});
var memberList = mongoose.model('memberList',playerRankingSchema);

module.exports = memberList;

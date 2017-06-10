var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");
autoIncrement = require('mongoose-auto-increment');

var resultSchema = mongoose.Schema({
  // email: {type:String, required:true, unique:true},
  gamename: {type:String},
  gDate: {type:Date},
  pName1: {type:String},
  pName2: {type:String},
  score1: {type:Number},
  score2: {type:Number},
  result: {type:Number},
  sid: {type:Number}
});

resultSchema.plugin(autoIncrement.plugin, {
    model: 'ResultSet',
    field: 'rsId',
    startAt: 1000,
    incrementBy: 1
});
var ResultSet = mongoose.model('ResultSet',resultSchema);

module.exports = ResultSet;

var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var tntSchema = new Schema({
  gameid : {type:String},
  tnt_all: {type: 'object'},
  gameDate: {type:Date, default:Date.now}
});

var mtnt_all = mongoose.model('mtnt_all',tntSchema);

module.exports = mtnt_all;

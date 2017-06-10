var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var tntSchema = new Schema({
  gid : Number,
  tnt_l32: {type: 'object'},
  //gameDate: {type:Date, default:Date.now}
  gameDate: {type:Date}
});

var mtnt_low32 = mongoose.model('mtnt_low32',tntSchema);

module.exports = mtnt_low32;

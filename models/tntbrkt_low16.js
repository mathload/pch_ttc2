var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var tntSchema = new Schema({
  gid : Number,
  tnt_l16: {type: 'object'},
  gameDate: {type:Date, default:Date.now}
});

var mtnt_low16 = mongoose.model('mtnt_low16',tntSchema);

module.exports = mtnt_low16;

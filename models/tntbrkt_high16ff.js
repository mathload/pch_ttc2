var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var tntSchema = new Schema({
  gid : Number,
  tnt_h16ff: {type: 'object'},
  gameDate: {type:Date, default:Date.now}
});

var mtnt_high16ff = mongoose.model('mtnt_high16ff',tntSchema);

module.exports = mtnt_high16ff;

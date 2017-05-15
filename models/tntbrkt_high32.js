var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var tntSchema = new Schema({
  gid : Number,
  tnt_h: {type: 'object'}
});

var mtnt_high = mongoose.model('mtnt_high',tntSchema);

module.exports = mtnt_high;

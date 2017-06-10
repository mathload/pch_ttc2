var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var gbracketSchema = new Schema({

  gid : Number,
  group_each: {type: 'object'},
  gameDate: {type:Date}
  //gameDate: {type:Date, default:Date.now}
});

var gbkt_each = mongoose.model('gbkt_each',gbracketSchema);

module.exports = gbkt_each;

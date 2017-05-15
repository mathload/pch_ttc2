var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var gbracketSchema = new Schema({

  gid : Number,
  group_each: {type: 'object'}
});

var gbkt_each = mongoose.model('gbkt_each',gbracketSchema);

module.exports = gbkt_each;

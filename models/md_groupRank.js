var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
var groupRankSchema = new Schema({

  rid : Number,
  group_rank : {type: 'object'}

});

var md_gRank = mongoose.model('md_gRank',groupRankSchema);

module.exports = md_gRank;

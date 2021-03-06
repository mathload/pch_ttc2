var express  = require('express');
var app      = express();
var path     = require('path');
var mongoose = require('mongoose');
var session  = require('express-session');
var flash    = require('connect-flash');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var passport       = require("./config/passport");
var autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = require('bluebird');

// database
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
autoIncrement.initialize(db);
db.once("open",function () {
  console.log("DB connected! ");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

// view engine
app.set("view engine", 'ejs');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(flash());
//app.use(session({secret:'MySecret'}));
app.use(session({secret: '<mysecret>',
                 saveUninitialized: true,
                 resave: true}));
app.use(countVisitors);

// passport //after session setting
var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

// ================================================================
// setup routes
// ================================================================

app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/rating', require('./routes/rating'));
app.use('/admin', require('./routes/admin'));
app.use('/gbooks', require('./routes/gbooks'));
app.use('/rt_gbrackets_v2', require('./routes/rt_gbrackets_v2'));
app.use('/rt_rankview', require('./routes/rt_rankview'));
app.use('/tbrackets', require('./routes/rt_tbrackets_all'));
app.use('/tbrackets_make', require('./routes/rt_tbrackets_make'));
// app.use('/rt_resultset', require('./routes/rt_resultset'));
app.use('/rt_resistMember', require('./routes/rt_resistMember'));
app.use('/rt_updateRanking', require('./routes/rt_updateRanking'));
app.use('/rt_viewRating', require('./routes/rt_viewRating'));
app.use('/rbtable', require('./routes/rt_rbtable/rt_rbtable'));
app.use('/rbtable_rankcal', require('./routes/rt_rbtable/rt_rbtable_rankcal'));
app.use('/pastgame', require('./routes/rt_pastgame'));

// start server
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});

function countVisitors(req,res,next){
  if(!req.cookies.count&&req.cookies['connect.sid']){
    res.cookie('count', "", { maxAge: 3600000, httpOnly: true });
    var now = new Date();
    var date = now.getFullYear() +"/"+ now.getMonth() +"/"+ now.getDate();
    if(date != req.cookies.countDate){
      res.cookie('countDate', date, { maxAge: 86400000, httpOnly: true });

      var Counter = require('./models/Counter');
      Counter.findOne({name:"vistors"}, function (err,counter) {
        if(err) return next();
        if(counter===null){
          Counter.create({name:"vistors",totalCount:1,todayCount:1,date:date});
        } else {
          counter.totalCount++;
          if(counter.date == date){
            counter.todayCount++;
          } else {
            counter.todayCount = 1;
            counter.date = date;
          }
          counter.save();
        }
      });
    }
  }
  return next();
}

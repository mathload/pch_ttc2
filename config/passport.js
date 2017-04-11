var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../models/User');

// serialize & deserialize User
//세션에 user객체 기록
passport.serializeUser(function(user, done) {
  done(null, user.id);  // id는 식별자로 db에서 unique/primary 등으로 선언된것 사용 - 몽고디비에 암호화하여 자동생성된듯? 언제 만들었지???
});

// 향후 접속시 마다 호출되어 실행된다 이후 값을 불러올때 req.user.displayName하면 된다
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// local strategy를 이용한 인증(username과 password이용)
passport.use('local-login',
  new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({ 'username' :  username }, function(err, user) {
        if (err) return done(err);

        if (!user){
            req.flash("username", req.body.username);
            return done(null, false, req.flash('loginError', 'No user found.')); // 또는 {message:'loginError', 'No user found.'}
        }
        if (!user.authenticate(password)){
            req.flash("username", req.body.username);
            return done(null, false, req.flash('loginError', 'Password does not Match.'));
        }
        req.flash('postsMessage', 'Welcome '+user.username+'!');
        return done(null, user); // 인증성공시 passport.serializeUse함수를 호출하면서 user객체 전달
                                //회원가입인경우 이후 passport의 req.login() req.logout()함수을 사용할수 있다
      });
    }
  )
);

module.exports = passport;

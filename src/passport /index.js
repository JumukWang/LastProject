const passport = require('passport');
const { User } = require('../models/user');
const kakao = require('./soscialStrategy'); // 카카오서버로 로그인할때
const google = require('./soscialStrategy'); // 구글 서버로 로그인할때

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ id })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
  kakao();
  google();
};

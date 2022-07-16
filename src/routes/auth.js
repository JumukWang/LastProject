require('dotenv').config();
const { User } = require('../models');
const Bcrypt = require('bcrypt');
const passport = require('passport');
const router = require('express').Router();
const jwt = require('../util/jwt-util');
const redisClient = require('../database/redis');
const config = require('../config');
const { logging } = require('../middlewares')

const { validateEmail, validateNick, validatePwd, validateAll } = require('../middlewares/validation');

// 회원가입
router.post('/signup', logging, validateAll, async (req, res, next) => {
  try {
    // test 용 confirm password 넣어야함 비밀번호 해쉬화 해야함
    const { email, nickname, password, passwordCheck, profile_url } = req.body;

    if (password !== passwordCheck) {
      res.status(400).send({
        message: '비밀번호 확인란이 일치하지 않습니다.',
        result: false,
      });
      return;
    }
    const salt = await Bcrypt.genSalt(Number(config.SALT_NUM));
    const hashPassword = await Bcrypt.hash(password, salt);

    const user = new User({
      email,
      nickname,
      password: hashPassword,
      profile_url,
    });
    await user.save();

    const token = jwt.authSign(user);

    return res.status(200).send({
      result: true,
      msg: '회원가입이 되었습니다.',
      accesstoken: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      result: false,
      msg: '다시 회원가입을 신청해 주세요',
      message: error.message,
    });
  }
});

// 로그인
router.post('/login', logging, validatePwd, async (req, res, next) => {
  try {
    // 여기도 중복검사, 해쉬화된 비밀번호 검증
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).send({
        msg: '아이디 혹은 비밀번호를 확인해주세요.',
      });
    }
    let bcpassword = '';
    if (user) {
      bcpassword = Bcrypt.compare(password, user.password);
    }
    if (!bcpassword) {
      return res.status(400).send({
        errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
        result: false,
      });
    }

    const accessToken = jwt.authSign(user);
    const refreshToken = jwt.refreshToken();

    redisClient.set(user.id, refreshToken);

    return res.status(200).send({
      userId: user.userId,
      eamil: user.nickname,
      nickname: user.nickname,
      userImg: user.profile_url,
      accessToken: accessToken,
      refreshToken: refreshToken,
      result: true,
      msg: '로그인 되었습니다',
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '다시 로그인 신청해 주세요',
      message: error.message,
    });
  }
});

// 이메일 중복검사
router.get('/user/exemail', validateEmail, async (req, res, next) => {
  try {
    const { email } = req.body;
    const exisEmail = await User.findOne({
      email,
    });
    if (exisEmail) {
      return res.status(400).send({
        result: false,
        msg: '이미 사용중인 이메일 입니다.',
      });
    }
    return res.status(200).send({
      result: 'true',
      msg: '사용 가능한 이메일 입니다.',
    });
  } catch (error) {
    error.message;
  }
});

// 닉네임 중복검사
router.get('/user/exnickname', validateNick, async (req, res, next) => {
  try {
    const { nickname } = req.body;
    const exitNick = await User.findOne({
      nickname,
    });
    if (exitNick) {
      return res.status(400).send({
        result: false,
        msg: '이미 사용중인 닉네임 입니다.',
      });
    }
    return res.status(200).send({
      result: true,
      msg: '사용 가능한 닉네임 입니다.',
    });
  } catch (error) {
    error.message;
  }
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', { failureRedirect: '/' }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname } = user;
    const accessToken = jwt.authSign({ userId, nickname });
    const result = {
      accessToken,
      nickname,
    };
    console.log(user);
    res.send({ user: result });
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
    // user 객체 뜯어보기
    if (err) return next(err);
    const { userId, nickname } = user;
    const accessToken = jwt.authSign({ userId, nickname });
    const result = {
      accessToken,
    };
    res.send({ user: result });
  })(req, res, next);
});

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/",
//   }),
//   (req, res) => {
//     res.redirect("/")
//   }
// )

module.exports = router;

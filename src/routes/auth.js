require('dotenv').config();
const { User } = require('../models');
const Bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('../util/jwt-util');
const config = require('../config');
const redisClient = require('../database/redis');
const { profileUpload } = require('../middlewares/upload')

const { validateNick, validatePwd, validateAll } = require('../middlewares/validation');

// 회원가입
router.post('/signup', profileUpload.single('profile_url'), async (req, res) => {
  try {
    // test 용 confirm password 넣어야함 비밀번호 해쉬화 해야함
    const { email, nickname, password, passwordCheck } = req.body;
    const profileUrl = req.file; //추가
    console.log(profileUrl)
    const imgFile = await profileUrl.transforms[0].location; //추가
    console.log(imgFile)
    const exEmail = await User.findOne({
      email,
    });

    if (exEmail) {
      return res.status(400).send({
        result: false,
        msg: '이미 사용중인 이메일 입니다.',
      });
    }
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
      profile_url : imgFile, //추가
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

// 회원가입 이미지 저장 

// router.post('/image', profileUpload.single('profile_url'), async (req, res) => {
//     const profileUrl = req.file; //추가
//     console.log(profileUrl)
//     const imgFile = await profileUrl.transforms[0].location; //추가
//     console.log(imgFile)
//     try {
//       const imgFile = await profileUrl.transforms[0].location; //추가
//       console.log(imgFile)

//       const user = new User({
//         profile_url : imgFile,
//       });
//       await user.save();
//         //사진경로가있는 주소를  imgurl이라는 이름으로 저장
//         res.status(200).json({ imgurl: imgFile });
//     } catch (err) {
//         res.send({ msg : "에러발생"});
        
//     }
// });

// 로그인
router.post('/login', validatePwd, async (req, res) => {
  try {
    // 여기도 중복검사, 해쉬화된 비밀번호 검증
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
    redisClient.set(email, {
      refreshToken,
      nickname: user.nickname,
    });

    return res.status(200).send({
      userId: user.userId,
      email: user.email,
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

// 닉네임 중복검사
router.post('/exnickname', validateNick, async (req, res) => {
  try {
    const { nickname } = req.body;
    const exNick = await User.findOne({ nickname });

    if (exNick) {
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

module.exports = router;

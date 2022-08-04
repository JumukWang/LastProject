const Bcrypt = require('bcrypt');
const jwt = require('../util/jwt-util');
const config = require('../config');
const redisClient = require('../database/redis');
const userData = require('../models/user');

async function signup(req, res) {
  try {
    // test 용 confirm password 넣어야함 비밀번호 해쉬화 해야함
    const { email, nickname, password, passwordCheck } = req.body;
    const profileUrl = req.file;
    if (profileUrl) {
      const imgFile = await profileUrl.transforms[0].location;
      const exEmail = await userData.findByUser(email);

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

      const user = await userData.newUser({
        email,
        nickname,
        password: hashPassword,
        profile_url: imgFile,
      });

      const token = jwt.authSign(user);

      return res.status(200).send({
        result: true,
        msg: '회원가입이 되었습니다.',
        accessToken: token,
      });
    } else {
      const exEmail = await userData.findByUser(email);

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

      const user = await userData.newUser({
        email,
        nickname,
        password: hashPassword,
        profile_url: 'https://lastproject01.s3.ap-northeast-2.amazonaws.com/uploadProfile/2631659277971842.png',
      });

      const token = jwt.authSign(user);

      return res.status(200).send({
        result: true,
        msg: '회원가입이 되었습니다.',
        accessToken: token,
      });
    }
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '다시 회원가입을 신청해 주세요',
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userData.findByUser(email);
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
        errmsg: '이메일 또는 패스워드가 틀렸습니다.',
        result: false,
      });
    }
    // 토큰 발급 refreshToken은 redis에 키벨류로 저장
    const accessToken = jwt.authSign(user);
    const refreshToken = jwt.refreshToken();
    redisClient.set(email, {
      refreshToken,
    });

    return res.status(200).send({
      userId: user.userId,
      email: user.email,
      nickname: user.nickname,
      imgurl: user.profile_url,
      accessToken: accessToken,
      refreshToken: refreshToken,
      result: true,
      msg: '로그인 되었습니다',
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '다시 로그인 신청해 주세요',
      errmsg: error.message,
    });
  }
}

async function exnickname(req, res) {
  try {
    const { nickname } = req.body;
    const exNick = await userData.nicknameCheck(nickname);

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
    return res.status(400).send({
      result: false,
      errmsg: error.message,
    });
  }
}

module.exports = {
  signup,
  login,
  exnickname,
};

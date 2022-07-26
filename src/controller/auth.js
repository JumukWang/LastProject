async function signup(req, res, next) {
  try {
    // test 용 confirm password 넣어야함 비밀번호 해쉬화 해야함
    const { email, nickname, password, passwordCheck, profile_url } = req.body;
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
}

async function login(req, res, next) {
  try {
    // test 용 confirm password 넣어야함 비밀번호 해쉬화 해야함
    const { email, nickname, password, passwordCheck, profile_url } = req.body;
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
}

module.exports = { signup, login };

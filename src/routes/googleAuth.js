const { OAuth2Client } = require('google-auth-library');
const router = require('express').Router();
const { User } = require('../models');
const jwt = require('../util/jwt-util');
const config = require('../config');

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const updateToken = (payload) => {
  const { sub, email, nickname, iconUrl } = payload;
  const userToken = jwt.authSign({
    id: sub,
    nickname,
    email,
    iconUrl,
  });

  return userToken;
};

const insertUserIntoDB = (payload) => {
  const { sub, email, nickname, iconUrl } = payload;
  const userToken = jwt.authSign({
    id: sub,
    nickname,
    email,
    iconUrl,
  });
  return userToken;
};

router.post('/login', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.it,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub']; //21자리의 Google 회원 id 번호
    const exUser = await User.findOne({ userId });
    let token = '';
    if (exUser) {
      console.log('DB에 있는 유저');
      token = updateToken(payload);
    } else {
      console.log('DB에 없는 유저');
      //새로 유저를 만들면 jwt 토큰값을 받아온다.
      token = insertUserIntoDB(payload);
    }
    res.send({
      token,
    });
  } catch (error) {
    res.status(400).send({
      result: false,
      msg: error.message,
    });
  }
});

module.exports = router;

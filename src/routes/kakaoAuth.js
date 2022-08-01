const config = require('../config');
const { User } = require('../models');
const router = require('express').Router();
const jwt = require('../util/jwt-util');

// const logger = require('../config');
router.post('/login', (req, res) => {
  try {
    const api_url = 'https://kapi.kakao.com/v2/user/me';
    const request = require('request');
    const access_token = req.body.access_token;
    const options = {
      url: api_url,
      headers: { Authorization: `Bearer ${access_token}` },
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
        res.end(body);
      } else {
        console.log('error');
        if (response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  } catch (err) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + err);
  }
});

router.post('/newuser', async (req, res) => {
  try {
    // console.log("kakao_parsing의 req정보다",req)

    const user_info = req.body;
    const snsId = user_info.user_id;
    const userEmail = user_info.user_email;
    const nickname = user_info.user_name;
    const exUser = await User.findOne({ $and: [{ snsId }, { provider: 'kakao' }] });
    const accessToken = jwt.authSign({ nickname });
    const refreshToken = jwt.refreshToken();

    if (!exUser) {
      const newUser = new User({
        email: userEmail,
        nickname: nickname,
        password: config.KAKAO_BASIC_PASSWORD,
        profileUrl: config.KAKAO_IMAGE,
        snsId: snsId,
        provider: 'kakao',
      });

      newUser.save();

      return res.send({
        accessToken,
        refreshToken,
        nickname,
        profileUrl: config.KAKAO_IMAGE,
        snsId,
      });
    }
    const profileUrl = exUser.profile_url;
    return res.send({
      accessToken,
      refreshToken,
      nickname,
      profileUrl,
      snsId,
    });
  } catch (error) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + error);
  }
});

module.exports = router;

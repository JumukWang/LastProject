const config = require('../config');
const { User } = require('../models');
const { authSign } = require('../util/jwt-util');
const router = require('express').Router();

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const api_url = 'https://kapi.kakao.com/v2/user/me';
    const request = require('request');
    const access_token = req.body.access_token;
    // var header = 'Bearer ' + token; // Bearer 다음에 공백 추가
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

router.post('/', async (req, res) => {
  try {
    // console.log("kakao_parsing의 req정보다",req)
    const user_info = req.body;
    console.log('user_info정보다', user_info);
    const snsId = user_info.user_id;
    const userEmail = user_info.user_email;
    const nickname = user_info.user_name;
    const exUser = await User.findOne({ $and: [{ snsId }, { provider: 'kakao' }] });
    console.log('exUser: ', exUser);
    const accessToken = authSign({ nickname });
    console.log('accessToken 정보임', accessToken);

    // 만약 디비에 user의 email이 없다면,

    if (!exUser) {
      console.log('여기1111');
      const newUser = new User({
        email: userEmail,
        nickname: nickname + Math.floor(Math.random() * 10000000),
        password: config.KAKAO_BASIC_PASSWORD,
        profileUrl: '',
        snsId: snsId,
        provider: 'kakao',
      });
      console.log('newUser정보임', newUser);
      // 저장하기
      newUser.save();
      return res.send({
        accessToken,
        nickname,
        profileUrl: '',
      });
    }
    const profileUrl = exUser.profileUrl;
    return res.send({
      accessToken,
      nickname,
      profileUrl,
    });
  } catch (error) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + error);
  }
});

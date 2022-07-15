const config = require('../config');
const jwt = require('../util/jwt-util');

router.post('/', (req, res, next) => {
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

        // console.log("받아오는 error",error);
        console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ');
        // console.log("받아오는 response",response);
        console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ');
        // console.log("받아오는 body값",body);
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

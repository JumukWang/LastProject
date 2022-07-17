const { logger } = require('../config');
// const jwt = require('jsonwebtoken');
// const config = require('../config');

exports.logging = (req, res, next) => {
  var logStr = {};
  try {
    // 접속 경로
    // logStr.url = req.originalUrl;
    // console.log('cookies : ', req.cookies);

    // const verify = jwt.verify('쿠키 안의 토큰 위치', config.SECRET_KEY, { expiresIn: '86400000' });

    // // 쿠키 안의 토큰 (로그인 정보)
    // logStr.loginData = verify.isLogined; // 토큰의 정보

    // // 메소드
    // logStr.method = req.method;

    switch (req.method) {
      case 'GET':
        logStr.query = req.query;
        break;
      case 'POST':
        logStr.body = req.body;
        break;
      case 'DELETE':
        logStr.query = req.query;
        break;
    }

    logger.info(JSON.stringify(logStr));

    next();
  } catch (Err) {
    logger.error(Err);
    res.send({ success: false });
  }
};

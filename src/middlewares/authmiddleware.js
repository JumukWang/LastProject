const jwt = require('jsonwebtoken');
const { tokenVerify, refreshVerify, authSign } = require('../util/jwt-util');
const { User } = require('../models');
const logger = require('../config/winston');

module.exports = async (req, res, next) => {
  logger.info('jwt req start');
  if (req.headers.authorization) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const tokenRsult = tokenVerify(authToken); // 엑세스 토큰 넘어옴
    // bearer 확인 코드 넣기 invailed code 넣어주기
    if (tokenRsult.result) {
      // 엑세스 토큰 만료시 false, msg 'jwt expired'
      req.email = tokenRsult.email;
      req.nickname = tokenRsult.nickname;
      next();
    }
  } else {
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.',
    });
    return;
  }
  try {
    // 헤더에서 인증, 토큰 비교 검증
    logger.info('jwt refresh 인증 시작');
    if (req.headers.authorization && req.headers.refreshtoken) {
      const authToken = req.headers.authorization.split('Bearer ')[1];
      const refreshToken = req.headers.refreshtoken;
      // access token이 만료됐는지 검증
      const accessResult = tokenVerify(authToken);
      // access token 디코딩
      const decode = jwt.decode(authToken);

      if (decode === null) {
        res.status(401).send({
          result: false,
          msg: '인증 정보가 없습니다.',
        });
      }

      //access token decoding 값에서 id를 가져와 refresh token 검증
      let user = null;
      user = await User.findOne({ email: decode.email });
      const refreshResult = refreshVerify(refreshToken, user.email);
      logger.info('jwt refresh 중간 인증 시작');
      if (accessResult.msg === 'jwt expired' && accessResult.result === false) {
        if (refreshResult.result === false) {
          return res.status(401).send({
            result: false,
            msg: '인증에 실패했습니다.',
          });
        } else {
          const newToken = authSign(user);

          return res.status(200).send({
            result: true,
            accessToken: newToken,
            refreshToken,
          });
        }
      } else {
        return res.status(400).send({
          // 토큰이 둘 다 만료된 상황
          result: false,
          msg: 'refresh token, access token 갱신이 필요합니다.',
        });
      }
    }
  } catch (error) {
    return res.status(401).send({
      result: false,
      msg: error.message,
    });
  }
};

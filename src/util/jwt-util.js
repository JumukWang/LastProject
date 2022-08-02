const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('../database/redis');
const config = require('../config');
const logger = require('../config/winston');

module.exports = {
  // access 토큰 발급
  authSign: (user) => {
    const payload = {
      email: user.email,
      nickname: user.nickname,
    };
    return jwt.sign(payload, config.SECRET_KEY, {
      // token 발급
      algorithm: 'HS256',
      expiresIn: '10s',
    });
  },
  tokenVerify: (authToken) => {
    // token 검증
    let decode = null;
    try {
      logger.info('jwt 인증 시작');
      decode = jwt.verify(authToken, config.SECRET_KEY);
      logger.info('jwt 인증 성공');
      return {
        result: true,
        email: decode.email,
        nickname: decode.nickname,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        result: false,
        msg: error.message,
      };
    }
  },
  refreshToken: () => {
    return jwt.sign({}, config.SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  refreshVerify: async (token, userId) => {
    // refresh 검증
    // redis 모듈은 promise를 반환하지 않으므로 promisify를 써준다.
    const getAsync = promisify(redisClient.get).bind(redisClient);
    try {
      const recieveToken = await getAsync(userId);
      if (token === recieveToken) {
        try {
          jwt.verify(token, config.SECRET_KEY);
          return true;
        } catch (error) {
          return {
            result: false,
            msg: error.message,
          };
        }
      } else {
        return false;
      }
    } catch (error) {
      return {
        result: false,
        msg: error.message,
      };
    }
  },
};

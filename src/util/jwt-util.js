const { promisify } = require("util")
const jwt = require("jsonwebtoken")
const redisClient = require("../database/redis")
const SECRET = process.env.SECRET_KEY

module.exports = {
  // access 토큰 발급
  authSign: (user, res, req) => {
    const payload = {
      email: user.email,
      nickname: user.nickname,
      
    }
    return jwt.sign(payload, SECRET, {
      // token 발급
      algorithm: 'HS256',
      expiresIn: "10s",
    })
    
    
  },
  tokenVerify: (authToken) => {
    // token 검증
    let decode = null
    try {
      decode = jwt.verify(authToken, SECRET)
      return {
        result: true,
        email: decode.email,
        nickname: decode.nickname,
      }
    } catch (error) {
      return {
        result: false,
        msg: error.message,
      }
    }
  },
  refreshToken: () => {
    return jwt.sign({}, SECRET, {
      algorithm: 'HS256',
      expiresIn: "14d",
    })
  },
  refreshVerify: async (token, userId) => {
    // refresh 검증
    // redis 모듈은 promise를 반환하지 않으므로 promisify를 써준다.
    const getAsync = promisify(redisClient.get).bind(redisClient)
    try {
      const recieveToken = await getAsync(userId)
      if (token === recieveToken) {
        try {
          jwt.verify(token, SECRET)
          return true
        } catch (error) {
          return {
            result: false,
            msg: error.message,
          }
        }
      } else {
        return false
      }
    } catch (error) {
      return {
        result: false,
        msg: error.message,
      }
    }
  },
}

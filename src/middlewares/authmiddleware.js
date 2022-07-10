const jwt = require("jsonwebtoken")
const { tokenVerify, refreshVerify, authSign } = require("../util/jwt-util")

module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    const authToken = req.headers.authorization.split("Bearer ")[1]
    const tokenRsult = tokenVerify(authToken) // 엑세스 토큰 넘어옴
    if (tokenRsult.result) { // 엑세스 토큰 만료시 false, msg 'jwt expired'
      req.email = tokenRsult.email
      req.nickname = tokenRsult.nickname
      next();   
    }
  } else {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    })
    return
  }
  
  try {
    // 헤더에서 인증, 토큰 비교 검증
    if (req.headers.authorization && req.headers.refreshToken) {
      const authToken = req.headers.authorization.split("Bearer ")[1]
      const refreshToken = req.headers.refreshToken

      // access token이 만료됐는지 검증
      const accessResult = tokenVerify(authToken)
      // access token 디코딩
      const decode = jwt.decode(authToken)
      
      if (decode === null) {
        res.status(401).send({
          result: false,
          msg: "인증 정보가 없습니다.",
        })
      }

      //access token decoding 값에서 id를 가져와 refresh token 검증
      const refreshResult = refreshVerify(refreshToken, decode.id)

      if (accessResult.msg === "jwt expired" && accessResult.result === false) {
        if (refreshResult.result === false) {
          res.status(401).send({
            result: false,
            msg: "인증에 실패했습니다.",
          })
        } else {
          const newToken = authSign(user)

          res.status(200).send({
            result: true,
            token: {
              accessToken: newToken,
              refreshToken,
            },
    
          })
        }
      } else {
        res.status(400).send({ // 토큰이 둘 다 만료된 상황
          result: false,
          msg: "refresh token, access token 갱신이 필요합니다.",
        })
      }
    }
  } catch (error) {
    res.status(401).send({
      result: false,
      msg: error.message,
    })
  }
}

// await redisClient.connect();

// let token = await redisClient.get("key")
// 프론트에서 쿠키에 세션 아이디를 쿠키에 담아서 키로 벨류를 비교
// 세션 아이디를 확인 세션아이디 토큰 확인 ex) 이메일 / 토큰
// if(token) {
//   return;
// }

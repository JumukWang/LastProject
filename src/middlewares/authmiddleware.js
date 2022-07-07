const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // await redisClient.connect();

  // let token = await redisClient.get("key")
  // 프론트에서 쿠키에 세션 아이디를 쿠키에 담아서 키로 벨류를 비교
  // 세션 아이디를 확인 세션아이디 토큰 확인 ex) 이메일 / 토큰
  // if(token) {
  //   return;
  // }
  const { authorization } = req.headers;
  const [authType, authToken] = authorization.split(" ");
  
  if(authToken && authType === "Bearer") {
    const tokenVerify = verify(authToken);
    if(tokenVerify){
      req.email,
      req.nickname
      next();
    }
  }else{
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }
}
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const {User} = require("../models");
const redis = require("redis");
// const redisStore = require("connect-redis")(session)

// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  // password: process.env.REDIS_PASSWORD,
// })
module.exports = async (req, res, next) => {
  // await redisClient.connect();

  // let token = await redisClient.get("key")
  // 프론트에서 쿠키에 세션 아이디를 쿠키에 담아서 키로 벨류를 비교
  // 세션 아이디를 확인 세션아이디 토큰 확인 ex) 이메일 / 토큰
  // if(token) {
  //   return;
  // }
  
  const { authorization } = req.headers;
  if (authorization == null) {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }
  const [authType, authToken] = authorization.split(" ");
  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인이 필요한 기능입니다.",
    });
    return;
  }
  try {
    const myToken = verifyToken(authToken);

    console.log("accessToken 유효성 검사 정보입니다.",myToken)
    if (myToken == "jwt expired") {
      // access token 만료
      console.log("accessToken이 만료되었습니다.");

      const decodedToken = jwt.decode(authToken, SECRET_KEY);
      console.log("decodedToken정보입니다.", decodedToken);
      const email = decodedToken.email;
      console.log(decodedToken.email);
      User.findOne({ email }).then(async(user) => {                                                
        console.log(user);
        const targetRefreshToken = user.refreshToken

        console.log('찾은 유저의 refreshtoken정보입니다.',targetRefreshToken);

        const refreshTokenCheck = verifyrefeshToken(targetRefreshToken);

        console.log("RefreshToken 유효성 검사 정보입니다.", refreshTokenCheck);

        if (refreshTokenCheck == "jwt expired") {
          console.log('두 토큰 모두 만료된 상태')
          return res.status(401).send({ message : "로그인이 필요합니다." });
        } else {
          console.log('accessToken만 만료된 상태')
          const myNewToken = jwt.sign(
            { email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
          );
          let newToken = {
            email,
            myNewToken
          }
          console.log('accessToken만 만료니까, 쿠키에다가 accesstoken넣어주기')
          res.cookie('accessToken', myNewToken);//쿠키에 access토큰 저장되는지 확인
          res.locals.user = newToken; //로컬스토리지에 저장되는지 프론트분께 물어보기, 둘중에 하나 지워야할듯
          // await redisClient.setEx("key", 1800, JSON.stringify(newToken));// JSON.stringify() 객체를 스트링으로 바꿔준다
          next();
        }
      });
    } else {
      const { email } = jwt.verify(authToken, SECRET_KEY);
      console.log('이 닉네임뭐지',email)
      User.findOne({ email }).then((user) => {
        res.locals.user = user;
        next();
      });
    }
  } catch (err) {
    res.status(401).send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};
//  유저정보에 토큰도 같이
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}
function verifyrefeshToken(refreshtoken) {
  try {
    return jwt.verify(refreshtoken, REFRESH_SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}
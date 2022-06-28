require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

module.exports = (req, res, next) => {
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
    if (myToken == "jwt expired") {
      // access token 만료
      console.log("만료되었습니다.");
      const userInfo = jwt.decode(authToken, SECRET_KEY);
      console.log("userInfo", userInfo);
      const nickname = userInfo.nickname;

      let refreshtoken;

      User.findOne({ nickname }).then((user) => {
        
        console.log(refreshtoken);
        
        const myRefreshToken = verifyrefeshToken(refreshtoken);
        console.log("myRefreshToken", myRefreshToken);
        if (myRefreshToken == "jwt expired") {
          res.send({ errorMessage: "로그인이 필요합니다." });
        } else {
          const myNewToken = jwt.sign(
            { nickname: user.nickname },
            REFRESH_SECRET_KEY,
            { expiresIn: "1h" }
          );
          let newToken = {
            nickname,
            myNewToken
          }
          res.locals.user = newToken;
          next();
        }
      });
    } else {
      const { nickname } = jwt.verify(authToken, SECRET_KEY);
      User.findOne({ nickname }).then((user) => {
        res.locals.user = user;
        next();
      });
    }
  } catch (err) {
    res.send({ errorMessage: err + " : 로그인이 필요합니다." });
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

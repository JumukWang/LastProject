const passport = require("passport")
const KakaoStrategy = require("passport-kakao").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user")

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/api/auth/kakao/callback",
      },

      //카카오서버에서 보낸 카카오 계정정보
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
            snsId: profile.id,
            social: "kakao",
          })
          // 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            done(null, exUser) // 로그인 인증 완료
          } else {
            let nickname = profile._json.properties.nickname
            if (profile._json.properties.nickname.length > 8) {
              nickname = profile._json.properties.nickname.substr(0, 8)
            }
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            const newUser = await User.create({
              provider: "kakao",
              snsId: profile.id,
              nickname,
              profileImg: profile._json.properties.profile_image,
            })
            // console.log(newUser)
            done(null, newUser) // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error)
          done(error)
        }
      }
    )
  )
}

const path = require("path")
const passport = require("passport")
const KakaoStrategy = require("passport-kakao").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user")

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: process.env.KAKAO_REDIRECT_URI,
      },

      //카카오서버에서 보낸 카카오 계정정보
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile)
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
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            const newUser = await User.create({
              provider: "kakao",
              snsId: profile.id,
              nickname: profile.nickname,
            })
            done(null, newUser) // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error)
          done(error)
        }
      }
    )
  )
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("google profile", profile)
        try {
          const exUser = await User.findOne({
            snsId: profile.id,
            provider: "google",
          })
          if (exUser) {
            done(null, exUser)
          } else {
            const newUser = await User.create({
              snsId: profile.id,
              nickname: profile.displayName,
              provider: "google",
            })
            done(null, newUser)
          }
        } catch (error) {
          console.error(error)
          done(error)
        }
      }
    )
  )
}
// 
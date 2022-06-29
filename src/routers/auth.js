require("dotenv").config()
const { User } = require("../models")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const Bcrypt = require("bcrypt")
const authMiddleware = require("../middlewares/authmiddleware")
const SALT_NUM = process.env.SALT_NUM
const SECRET_KEY = process.env.SECRET_KEY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY

const router = require("express").Router()

const {
  validateEmail,
  validateNick,
  validatePwd,
} = require("../middlewares/validation")

// 회원가입
router.post("/user", async (req, res, next) => {
  try {
    // test 용 confirm password 넣어야함 비밀번호 해쉬화 해야함
    const { email, nickname, password, passwordCheck, profileImg } = req.body

    const salt = await Bcrypt.genSalt(Number(SALT_NUM))
    const hashPassword = await Bcrypt.hash(password, salt)

    if (password !== passwordCheck) {
      res.status(400).send({
        message: "비밀번호 확인란이 일치하지 않습니다.",
        result: false,
      })
      return
    }

    await User.create({
      email,
      nickname,
      password: hashPassword,
      refreshToken: null,
      profileImg,
    })
    return res.status(200).send({
      result: true,
      msg: "회원가입이 되었습니다.",
    })
  } catch (error) {
    console.error(error)
    return res.status(400).send({
      result: false,
      msg: "다시 회원가입을 신청해 주세요",
      message: error.message,
    })
  }
})

// 로그인
router.post("/user/auth", async (req, res, next) => {
  try {
    // 여기도 중복검사, 해쉬화된 비밀번호 검증
    const { email, password } = req.body
    const user = await User.findOne({
      where: { email },
    })
    const accessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, {
        expiresIn: "10m",
    })
    const refreshToken = jwt.sign({}, REFRESH_SECRET_KEY, {
        expiresIn: "10d",
    })
    
    // await User.update({ where : { refreshToken : refreshToken }})

    res.status(200).send({
      result: true,
      msg: "로그인 되었습니다",
      token: accessToken,
    })
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "다시 로그인 신청해 주세요",
      message: error.message,
    })
  }
})

// 이메일 중복검사
router.get("/user/exemail", async (req, res, next) => {
  try {
    const { email } = req.body
    const exisEmail = await User.findOne({
      where: { email },
    })
    if (exisEmail) {
      return res.status(400).send({
        result: false,
        msg: "이미 사용중인 이메일 입니다.",
        message: error.message,
      })
    }
    return res.status(200).send({
      result: "true",
      msg: "사용 가능한 이메일 입니다.",
    })
  } catch (error) {
    error.message
  }
})

// 닉네임 중복검사
router.get("/user/exnickname", async (req, res, next) => {
  try {
    const { nickname } = req.body
    const exitNick = await User.findOne({
      where: { nickname },
    })
    if (exitNick) {
      return res.status(400).send({
        result: false,
        msg: "이미 사용중인 닉네임 입니다.",
        message: error.message,
      })
    }
    return res.status(200).send({
      result: true,
      msg: "사용 가능한 닉네임 입니다.",
    })
  } catch (error) {
    error.message
  }
})

router.get("/kakao", passport.authenticate("kakao"))

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/")
  }
)

// 카카오 로그아웃
// auth//kakao/logout
// router.get("/kakao/logout", async (req, res) => {
//   // https://kapi.kakao/com/v1/user/logout
//   try {
//     const ACCESS_TOKEN = res.locals.user.accessToken
//     let logout = await axios({
//       method: "post",
//       url: "https://kapi.kakao.com/v1/user/unlink",
//       headers: {
//         Authorization: `Bearer ${ACCESS_TOKEN}`,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     res.json(error)
//   }
//   // 세션 정리
//   req.logout()
//   req.session.destroy()

//   res.redirect("/")
// })

module.exports = router

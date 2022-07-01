require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const session = require("express-session")
const helmet = require("helmet")
const path = require("path")
const app = express()
const connect = require("./database/database.js")
const Router = require("./routes")
const passport = require("passport")
const passportConfig = require("./passport")

passportConfig() // 패스포트 설정
connect()

const corsOption = {
  origin: [
    'http://13.124.252.225'
  ],
  credential: true,
}

//미들웨어
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
)

//! express-session에 의존하므로 뒤에 위치해야 한다.
app.use(passport.initialize()) // 요청 객체에 passport 설정을 심음
app.use(passport.session()) // req.session 객체에 passport정보를 추가 저장

// 라우터
app.use("/api", Router)

// 서버 에러 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
  error.status = 404
  next(error)
})

app.use((error, req, res) => {
  res.local.message = error.message
  res.local.error = process.env.NODE_ENV !== "production" ? error : {}
  res.status(error.status || 500)
  res.render("error")
})

module.exports = app

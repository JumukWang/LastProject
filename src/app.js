require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const session = require("express-session")
const helmet = require("helmet")
const path = require("path")
const connect = require("./database/database.js")
const Router = require("./routes")
const passport = require("passport")
const passportConfig = require("./passport")
const cookieParser = require("cookie-parser")
const app = express()

passportConfig() // 패스포트 설정
connect()

//미들웨어
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.use(cookieParser(process.env.COOKIE_SECRET))
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
app.use(passport.initialize())
app.use(passport.session())

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

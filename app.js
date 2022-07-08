require("dotenv").config()
const path = require("path")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const express = require("express")
const passport = require("passport")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const RedisStore = require("connect-redis")(session)
const Router = require("./src/routes")
const passportConfig = require("./src/passport")
const connect = require("./src/database/database")
const redisClient = require("./src/database/redis")


redisClient.connect();
const app = express()
passportConfig() // 패스포트 설정
connect()



//미들웨어
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: false }))
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
    store: new RedisStore({ client: redisClient })
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
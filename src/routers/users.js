require("dotenv").config()
const express = require("express")
const router = express.Router()

// 회원가입
router.post("/user", (req, res, next) => {

})

// 로그인
router.post("/user/auth", (req, res, next) => {

})

// 이메일 중복검사
router.get("/user/exemail", async (req, res, next) => {
  
})

// 닉네임 중복검사
router.get("/user/exnickname", async (req, res, next) => {

})

module.exports = router

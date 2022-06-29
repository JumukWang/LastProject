require("dotenv").config()
const router = require("express").Router();


router.get('/get' ,(req, res, next) => {
    res.send({ message: "ㅅㅂ 제발...."});
})

module.exports = router

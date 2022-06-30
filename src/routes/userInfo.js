require("dotenv").config()
const router = require("express").Router();


router.get('/get' ,(req, res, next) => {
    res.send({ message: ""});
})

module.exports = router

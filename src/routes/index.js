const router = require("express").Router()
const authRouter = require("./auth")
const userRouter = require("./userInfo")
const roomRouter = require("./room")


router.use('/auth', authRouter)
router.use('/userInfo', userRouter)
router.use('/room', roomRouter)

module.exports = router

const router = require("express").Router()
const authRouter = require("./auth")
const userRouter = require("./users")
const roomRouter = require("./room")


router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/room', roomRouter)

module.exports = router

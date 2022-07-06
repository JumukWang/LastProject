const router = require("express").Router()
const authRouter = require("./auth")
const userRouter = require("./userInfo")
const roomRouter = require("./room")
const todoRouter = require("./todo")


router.use('/auth', authRouter)
router.use('/userInfo', userRouter)
router.use('/room', roomRouter)
router.use('/todo', todoRouter)



module.exports = router

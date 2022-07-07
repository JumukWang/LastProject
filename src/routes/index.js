const router = require("express").Router()
const authRouter = require("./auth")
const userRouter = require("./mypage")
const roomRouter = require("./room")
<<<<<<< HEAD
const todoRouter = require("./todo")

=======
const studytimeRouter = require("./studytime")
>>>>>>> origin/yechan2

router.use('/auth', authRouter)
router.use('/mypage', userRouter)
router.use('/room', roomRouter)
<<<<<<< HEAD
router.use('/todo', todoRouter)


=======
router.use('/studytime', studytimeRouter)
>>>>>>> origin/yechan2

module.exports = router

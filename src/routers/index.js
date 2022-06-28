const router = require("./users")
const userRouter = require("./users")
const authRouter = require("./auth")
const roomRouter = require("./room")

router.use("/users", userRouter)
router.use("/", authRouter)
router.use("/", roomRouter)


module.exports = router

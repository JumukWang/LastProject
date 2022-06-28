const router = require("./users")
const userRouter = require("./users")
const studyTimeRouter = require("./times")
const authRouter = require("./auth")

router.use("/users", userRouter)
router.use("/users", authRouter)
router.use("/users", studyTimeRouter)

module.exports = router

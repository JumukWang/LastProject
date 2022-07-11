require("dotenv").config()
const { Room, User } = require("../models")
const router = require("express").Router()
const { tokenVerify } = require("../util/jwt-util")
const authMiddleware = require("../middlewares/authmiddleware")

// 메인 페이지
router.get("/", async (req, res, next) => {
  try {
    const roomList = await Room.find({})
    return res.status(201).send({
      result: true,
      roomList,
    })
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "스터디를 불러올 수 없습니다.",
      errmsg: error.message,
    })
  }
})
// 유저에 배열 만들어서 저장해야함
// res.locals.user 못쓰니까 불러와서 써야함
router.post("/like/:roomId", authMiddleware, async (req, res, next) => {
  const roomId = Number(req.params.roomId)
  let userInfo = req.headers.authorization.split("Bearer ")[1]
  const decode = tokenVerify(userInfo)
  console.log(decode.nickname);

  if (roomId) {
    let flag = true
    await Room.updateOne({ roomId }, { $set: { isLiked: flag } })
  }
  // 여기서 배열에 저장하면 될 듯 합니다
  // const userRoomLike = await User.updateOne({ userId }, { $set: {userLike : roomId}})
  return res.status(201).send({
    result: true,
    msg: "스터디룸 좋아요를 눌렀습니다.",
  })
})

router.post("/dislike/:roomId", authMiddleware, async (req, res, next) => {
  const roomId = Number(req.params.roomId)
  if (roomId) {
    let flag = false
    await Room.updateOne({ roomId }, { $set: { isLiked: flag } })
  }
  // 여기서 배열에 저장하면 될 듯 합니다
  return res.status(201).send({
    result: true,
    msg: "스터디룸 좋아요를 취소했습다.",
  })
})

module.exports = router

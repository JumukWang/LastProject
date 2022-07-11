const { Room, User } = require("../models")
const authMiddleware = require("../middlewares/authmiddleware")

const router = require("express").Router()

// 메인 페이지 만들기

// 방조회
router.get("/rooms", async (req, res, next) => {
  try {
    const roomList = await Room.find({}).sort({ createAt: -1 })
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
// 호스트 / 참여중
// 스키마
// 방생성
router.post("/create/:userId", authMiddleware, async (req, res, next) => {
  try {
    const host = Number(req.params.userId)
    const { tagName, title, content, password, date, imgUrl } = req.body
    const newStudyRoom = await Room.create({
      tagName,
      title,
      content,
      password,
      date,
      imgUrl,
    })
    const roomNum = Number(newStudyRoom.roomId)
    await Room.updateOne({ roomId: roomNum }, { $set: { hostId: host } })
    await User.updateOne({ userId: host }, { $push: { hostRoom: roomNum } })
    return res
      .status(201)
      .send({ msg: "스터디룸을 생성하였습니다.", roomInfo: newStudyRoom })
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "스터디를 생성하지 못했습니다.",
      errmsg: error.message,
    })
  }
})

// 공개방 입장
router.post("/public-room/:roomId", authMiddleware, async (req, res, next) => {
  try {
    const roomId = Number(req.params.roomId)
    const [targetRoom] = await Room.find({ roomId })
    const { groupNum } = targetRoom

    if (groupNum >= 4) {
      return res.status(400).send({
        result: false,
        msg: "정원이 초과되었습니다.",
      })
    }
    await Room.updateOne({ groupNum }, { $inc: { groupNum: +1 } })
    return res.status(200).send(`${roomId}번방에 입장 했습니다 `)
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "스터디에 입장할 수 없습니다.",
      errmsg: error.message,
    })
  }
})

router.post("/private-room/:roomId", authMiddleware, async (req, res, next) => {
  try {
    const roomId = Number(req.params.roomId)
    const { password } = req.body
    const nickname = req.nickname
    const passCheck = await Room.findOne({ roomId: roomId })

    if (passCheck.password !== password) {
      return res.status(401).send({ msg: "비밀번호가 틀렸습니다 " })
    }
    return res.status(200).send(`${nickname}님이 입장하셨습니다`)
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "스터디에 입장할 수 없습니다.",
      errmsg: error.message,
    })
  }
})

// 방나가기
router.post("/exit/:roomId", async (req, res, next) => {
  try {
    const roomId = Number(req.params.roomId)
    const [targetRoom] = await Room.find({ roomId })
    const { groupNum } = targetRoom

    await Room.updateOne({ groupNum }, { $inc: { groupNum: -1 } })
    res.status(201).send({
      result: true,
      msg: "스터디 룸에서 나왔습니다.",
    })
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "스터디 나가기에 실패했습니다.",
      errmsg: error.message,
    })
  }
})

// 방삭제
router.delete("/:roomId/:userId", authMiddleware, async (req, res, next) => {
  try {
    const roomId = Number(req.params.roomId)
    const userId = Number(req.params.userId)
    const { password } = req.body
    const roomCheck = await Room.findOne({ roomId: roomId })

    const user = await User.findOne({userId})
    console.log(user);

    if (roomCheck.password !== password) {
      return res.status(401).send({
        result: false,
        msg: "비밀번호가 틀렸습니다",
      })
    }
    if(userId !== roomCheck.hostId) {
      return res.status(401).send({
        result: false,
        msg: "방의 호스트만 삭제할 수 있습니다."
      })
    }
    await Room.deleteOne({ roomId: roomId })

    return res.json({ result: true, msg: "스터디 룸이 삭제되었습니다." })
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: "스터디룸 삭제에 실패하였습니다.",
      errmsg: error.message,
    })
  }
})

// 스터디룸 검색
router.get("/search/:word", async (req, res, next) => {
  const { word } = req.params
  let roomArr = []
  let rooms = await Room.find({})
  try {
    for (let i in rooms) {
      if (rooms[i].title.includes(word)) {
        roomArr.push(rooms[i])
      }
    }
    return res.status(200).send(roomArr)
  } catch (error) {
    return res
      .status(400)
      .json({ result: false, Message: "찾으시는 스터디가 없습니다." })
  }
})

module.exports = router

require('dotenv').config();
const { Room, User } = require('../models');
const router = require('express').Router();
const { tokenVerify } = require('../util/jwt-util');
const authMiddleware = require('../middlewares/authmiddleware');

// 메인 페이지
router.get('/', async (req, res, next) => {
  try {
    const roomList = await Room.find({});
    return res.status(201).send({
      result: true,
      roomList,
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디를 불러올 수 없습니다.',
      errmsg: error.message,
    });
  }
});
// 유저에 배열 만들어서 저장해야함
// res.locals.user 못쓰니까 불러와서 써야함
router.post('/like/:roomId', authMiddleware, async (req, res, next) => {
  const roomId = Number(req.params.roomId);
  const nickname = req.nickname;
  const roomInfo = await Room.findOne({ roomId });

  if (roomId) {
    let flag = true;
    await Room.updateOne({ roomId }, { $set: { isLiked: flag } });
  }

  await User.updateOne({ nickname }, { $push: { userLike: roomInfo } });
  return res.status(201).send({
    result: true,
    msg: '스터디룸 좋아요를 눌렀습니다.',
  });
});

router.post('/dislike/:roomId', authMiddleware, async (req, res, next) => {
  const roomId = Number(req.params.roomId);
  const nickname = req.nickname;
  const roomInfo = await Room.findOne({ roomId });

  if (roomId) {
    let flag = false;
    await Room.updateOne({ roomId }, { $set: { isLiked: flag } });
  }

  await User.updateOne({ nickname }, { $pull: { userLike: roomInfo } });
  return res.status(201).send({
    result: true,
    msg: '스터디룸 좋아요를 취소했습다.',
  });
});

// 카테고리 전체조회 

router.get('/tag', async (req, res)=> {
  try {
      const roomList = await Room.find({}).sort("tagName")
      if (!roomList) {
          return res.status(400).json({
              success: false,
              msg: "해당 카테고리 방이 존재하지 않습니다."
          })
      }
      res.status(200).json({
          success: true,
          roomList,
      })
  } catch (error) {
      console.log(error)
      res.status(400).send({errorMessage: error.message})
  }
})

// 카테고리 조회 (미완성)
router.get('/tag/:tagName', async (req, res)=> {
  try {
      const { tagName } = req.params
      const roomList = await Room.find({ tagName }).sort("-createAt")
      if (!roomList) {
          return res.status(400).json({
              success: false,
              msg: "해당 카테고리 방이 존재하지 않습니다."
          })
      }
      res.status(200).json({
          success: true,
          roomList,
      })
  } catch (error) {
      console.log(error)
      res.status(400).send({errorMessage: error.message})
  }
})

module.exports = router;

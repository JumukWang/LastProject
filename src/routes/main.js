require('dotenv').config();
const { Room, User } = require('../models');
const router = require('express').Router();
const authMiddleware = require('../middlewares/authmiddleware');

// 메인 페이지
router.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 6)
    const roomLength = await Room.find({});
    const mainLength = roomLength.length;
    const roomList = await Room.find({})
        .sort({ createAt: -1 })
        .skip(perPage * (page - 1))     //만약 perPage가 10이라면 1page로 왔을 때 10*(1-1) = 0이라서 0부터 9까지 출력
        .limit(perPage)

    res.status(200).json({
      result: true,
      roomList,
      mainLength,
    })
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디를 불러올 수 없습니다.',
      errmsg: error.message,
    });
  }
});

// 좋아요
router.post('/like/:roomId', authMiddleware, async (req, res) => {
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

// 싫어요
router.post('/dislike/:roomId', authMiddleware, async (req, res) => {
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

//카테고리
router.get('/tag/:tagName', async (req, res) => {
  try {
    const { tagName } = req.params;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 6)
    const roomLength = await Room.find({ tagName });
    const tagLength = roomLength.length;
    const roomList = await Room.find({ tagName })
        .sort({ createAt: -1 })
        .skip(perPage * (page - 1))     //만약 perPage가 10이라면 1page로 왔을 때 10*(1-1) = 0이라서 0부터 9까지 출력
        .limit(perPage)

    res.status(200).json({
      result: true,
      roomList,
      tagLength,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
});


module.exports = router;

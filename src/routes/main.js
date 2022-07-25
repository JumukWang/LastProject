require('dotenv').config();
const { Room, User } = require('../models');
const router = require('express').Router();
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

router.get('/tag/:tagName', async (req, res) => {
  try {
    const { tagName } = req.params;
    const roomLength = await Room.find({ tagName });
    const roomList = await Room.find({ tagName })
      .sort('-createAt')
      .skip((tagName - 1) * 2)
      .limit(6);
    const tagLength = roomLength.length;
    if (!roomList) {
      return res.status(400).json({
        success: false,
        msg: '해당 카테고리 방이 존재하지 않습니다.',
      });
    }

    res.status(200).json({
      success: true,
      roomList,
      tagLength,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
});

module.exports = router;

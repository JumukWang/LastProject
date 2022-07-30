require('dotenv').config();
const { Room, User, Like } = require('../models');
const router = require('express').Router();
const authMiddleware = require('../middlewares/authmiddleware');

// 메인 페이지
router.get('/', async (req, res) => {
  try {
    const roomList = await Room.find({}).sort({ create: -1 });
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

// 찜
router.post('/like/:roomId/:userId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    // const nickname = req.nickname;
    console.log(userId)     //내 아이디
    const { likeUser, title } = await Room.findOne({ roomId })
    console.log(likeUser)   //방안에 유저아이디

    let likeStatus = ''
    let msg = ''

    //해당 방안에 내 아이디 유무확인
    if (!likeUser.includes(userId)) {
      await Room.updateOne({ roomId }, { $push: { likeUser: userId } })
      await User.updateOne({ userId }, { $push: { userLike: roomId } });
      likeStatus = true
      msg = `${title}방을 찜 했어요!`
    }
    else {
      await Room.updateOne({ roomId }, { $pull: { likeUser: userId } })
      await User.updateOne({ userId }, { $pull: { userLike: roomId } });
      likeStatus = false
      msg = `${title}방 찜 해제`
    }
    
    const [user] = await Room.find({ roomId }) 
    const likedUser = user.likeUser

    return res.status(201).send({
      // result: true,
      likeUser : likedUser,
      likeStatus: likeStatus,
      msg: msg,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).send({ errorMessage: error.message })
  }
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

router.post('/tag/:tagName', async (req, res) => {
  try {
    const { tagName } = req.params;
    const roomLength = await Room.find({ tagName });
    const roomList = await Room.find({ tagName }).sort({ createAt: -1 }).limit(6);
    const tagLength = roomLength.length;
    console.log(tagLength);

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

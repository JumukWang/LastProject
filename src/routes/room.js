const { Room, User } = require('../models');
const authMiddleware = require('../middlewares/authmiddleware');
const router = require('express').Router();
// 메인 페이지 만들기

// 방조회
router.get('/rooms', async (req, res) => {
  try {
    const roomList = await Room.find({}).sort({ createAt: -1 });
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
// 참여중
// 방생성
router.post('/create/:userId', authMiddleware, async (req, res) => {
  try {
    const host = Number(req.params.userId);
    const { tagName, title, content, password, date } = req.body;
    const newStudyRoom = await Room.create({
      title,
      password,
      content,
      date,
      tagName,
    });
    const roomNum = Number(newStudyRoom.roomId);
    await Room.updateOne({ roomId: roomNum }, { $set: { hostId: host } });
    await User.updateOne({ userId: host }, { $push: { hostRoom: newStudyRoom } });
    return res.status(201).send({ msg: '스터디룸을 생성하였습니다.', roomInfo: newStudyRoom });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디를 생성하지 못했습니다.',
      errmsg: error.message,
    });
  }
});

// 공개방 입장
// nickname profileimg
router.post('/public-room/:roomId', authMiddleware, async (req, res) => {
  try {
    // 유저 닉네임 프로필 유알엘 투두
    const roomId = Number(req.params.roomId);
    const nickname = req.nickname;
    const { groupNum, title } = await Room.findOne({ roomId: roomId });
    await Room.updateOne({ roomId: roomId }, { $inc: { groupNum: 1 } });

    if (groupNum >= 4) {
      return res.status(400).send({
        result: false,
        msg: '정원이 초과되었습니다.',
      });
    }
    return res.status(200).send({
      roomId,
      title,
      groupNum,
      nickname,
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디에 입장할 수 없습니다.',
      errmsg: error.message,
    });
  }
});

// 비밀방 입장
router.post('/private-room/:roomId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const { password } = req.body;
    const nickname = req.nickname;
    const passCheck = await Room.findOne({ roomId: roomId });
    const { groupNum, title } = await Room.findOne({ roomId: roomId });

    if (passCheck.password !== password) {
      return res.status(401).send({ msg: '비밀번호가 틀렸습니다 ' });
    }
    if (groupNum >= 4) {
      return res.status(400).send({
        result: false,
        msg: '정원이 초과되었습니다.',
      });
    }

    await Room.updateOne({ groupNum }, { $inc: { groupNum: 1 } });
    return res.status(200).send({
      roomId,
      title,
      nickname,
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디에 입장할 수 없습니다.',
      errmsg: error.message,
    });
  }
});

// 방나가기
router.post('/exit/:roomId', async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const [targetRoom] = await Room.find({ roomId });
    const { groupNum } = targetRoom;

    await Room.updateOne({ groupNum }, { $inc: { groupNum: -1 } });

    if (groupNum <= 0) {
      return res.status(400).send({
        result: false,
        msg: '참여 인원이 없습니다.',
      });
    }
    return res.status(201).send({
      groupNum,
      result: true,
      msg: '스터디 룸에서 나왔습니다.',
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디 나가기에 실패했습니다.',
      errmsg: error.message,
    });
  }
});

// 방삭제
router.delete('/:roomId/:userId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    const { password } = req.body;
    const roomCheck = await Room.findOne({ roomId: roomId });
    const user = await User.findOne({ userId });

    if (roomCheck.password !== password) {
      return res.status(401).send({
        result: false,
        msg: '비밀번호가 틀렸습니다',
      });
    }
    if (user !== roomCheck.hostId) {
      return res.status(401).send({
        result: false,
        msg: '방의 호스트만 삭제할 수 있습니다.',
      });
    }
    await Room.deleteOne({ roomId: roomId });

    return res.status(201).sned({ result: true, msg: '스터디 룸이 삭제되었습니다.' });
  } catch (error) {
    return res.status(401).send({
      result: false,
      msg: '스터디룸 삭제에 실패하였습니다.',
      errmsg: error.message,
    });
  }
});

// 스터디룸 검색
//! body로 받아서 수정하기
router.get('/search/:word', async (req, res) => {
  const { word } = req.params;
  let roomArr = [];
  let rooms = await Room.find({});
  try {
    for (let i in rooms) {
      if (rooms[i].title.includes(word)) {
        roomArr.push(rooms[i]);
      }
    }
    return res.status(201).send({
      roomArr,
      result: true,
    });
  } catch (error) {
    return res.status(401).json({ result: false, msg: '찾으시는 스터디가 없습니다.' });
  }
});

//참여중인 스터디 조회
router.get('/entered-room', authMiddleware, async (req, res) => {
  try {
    const nickname = req.nickname;

    const attendRoom = await User.find({ attendRoom }).sort('-createAt');

    if (!nickname === attendRoom.nickname) {
      return res.status(400).json({ result: false, msg: '참여중인 스터디를 찾을 수 없습니다.' });
    }
    if (!attendRoom) {
      return res.status(400).json({ result: false, msg: '해당 카테고리 방이 존재하지 않습니다.' });
    }
    res.status(200).json({
      result: true,
      attendRoom,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
});

//호스트중인 스터디 조회
router.get('/host-room/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const hostRoom = await User.find({ hostRoom }).sort('-createAt');

    if (!userId === hostRoom.userId) {
      return res.status(400).json({ result: false, msg: '호스트중인 스터디가 없습니다.' });
    }
    if (!hostRoom) {
      return res.status(400).json({ result: false, msg: '스터디를 불러올수없습니다.' });
    }
    res.status(200).json({
      result: true,
      hostRoom,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
});

//유저 초대하기
router.put('/invite', authMiddleware, async (req, res) => {
  try {
    const nickname = req.nickname;
    const { roomId } = req.body;
    const userList = await User.find({ nickname: { $ne: nickname } }).sort('nickname');
    //로그인한 나를 제외한 유저목록조회 (이름 순으로 정렬)
    if (!userList) {
      return res.status(400).json({ result: false, msg: '유저 리스트를 불러올 수 없습니다.' });
    }
    if (userList === nickname) {
      return res.status(400).json({ result: false, msg: '본인 포함 오류' });
    }

    const inviteUser = await Room.findOneAndUpdate({ roomId }, { $push: { userNickname: userList.nickname } });
    res.status(200).json({
      result: true,
      inviteUser,
      msg: '초대 완료',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
});
module.exports = router;

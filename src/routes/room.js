const { Room, User, Studytime } = require('../models');
const authMiddleware = require('../middlewares/authmiddleware');
const router = require('express').Router();
const moment = require('moment');
const { timeSet, changeTime, timeConversion } = require('../routes/studytime');
const { roomUpload } = require('../middlewares/upload')
// 메인 페이지 만들기

// 참여중
// 방생성
router.post('/create/:userId', authMiddleware, roomUpload.single('imgUrl'),  async (req, res) => {
  try {
    const roomUrl = req.file; //추가
    console.log(roomUrl)
    const imgFile = await roomUrl.transforms[0].location; //추가
    console.log(imgFile)
    const host = Number(req.params.userId);
    const { tagName, title, content, password, date } = req.body;
    const newStudyRoom = await Room.create({
      title,
      password,
      content,
      date,
      tagName,
      imgUrl : imgFile,
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
//! 유저 직접 넣어서 length로 수정해야함
router.post('/public-room/:roomId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const { groupNum, title } = await Room.findOne({ roomId: roomId });
    await Room.updateOne({ roomId: roomId }, { $inc: { groupNum: 1 } });

    if (groupNum >= 4) {
      return res.status(400).send({
        result: false,
        msg: '정원이 초과되었습니다.',
      });
    }
    const email = req.email;
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const now = new Date();
    const day = now.getDay();
    const inTimestamp = now.getTime();
    const start = await Studytime.create({ email, startTime, day, inTimestamp });
    const total = await Studytime.find({ email, day: day });

    if (total.length === 1) {
      return res.status(200).send({
        roomId,
        title,
        groupNum,
        start,
        email: total.email,
        day: total.day,
        hour: 0,
        minute: 0,
        second: 0,
        todayrecord: 0,
        weekrecord: 0,
      });
    } else {
      const lasttotal = total.slice(-2)[0];
      console.log(lasttotal);
      let hour = lasttotal.todaysum.substr(0, 2);
      let minute = lasttotal.todaysum.substr(3, 2);
      let second = lasttotal.todaysum.substr(6, 2);
      console.log(hour, minute, second);

      return res.status(200).send({
        roomId,
        title,
        groupNum,
        email: lasttotal.email,
        day: lasttotal.day,
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        todayrecord: lasttotal.todaysum,
        weekrecord: lasttotal.weeksum,
      });
    }
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디에 입장할 수 없습니다.',
      errmsg: error.message,
    });
  }
});

// 비밀방 입장
//! 유저 직접 넣어서 length로 수정해야함
router.post('/private-room/:roomId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const { password } = req.body;
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
    const email = req.email;
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const now = new Date();
    const day = now.getDay();
    const inTimestamp = now.getTime();
    const start = await Studytime.create({ email, startTime, day, inTimestamp });
    const total = await Studytime.find({ email, day: day });

    await Room.updateOne({ groupNum }, { $inc: { groupNum: 1 } });

    if (total.length === 1) {
      return res.status(200).send({
        roomId,
        title,
        groupNum,
        start,
        email: total.email,
        day: total.day,
        hour: 0,
        minute: 0,
        second: 0,
        todayrecord: 0,
        weekrecord: 0,
      });
    } else {
      const lasttotal = total.slice(-2)[0];
      console.log(lasttotal);
      let hour = lasttotal.todaysum.substr(0, 2);
      let minute = lasttotal.todaysum.substr(3, 2);
      let second = lasttotal.todaysum.substr(6, 2);
      console.log(hour, minute, second);

      return res.status(200).send({
        roomId,
        title,
        groupNum,
        email: lasttotal.email,
        day: lasttotal.day,
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        todayrecord: lasttotal.todaysum,
        weekrecord: lasttotal.weeksum,
      });
    }
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디에 입장할 수 없습니다.',
      errmsg: error.message,
    });
  }
});

// 방나가기
router.post('/exit/:roomId', authMiddleware, async (req, res) => {
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

    //시간저장
    const email = req.email;

    const { todayStart, weekStart, weekEnd } = timeSet();
    console.log(todayStart, weekStart, weekEnd);
    const outTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const now = new Date();
    const day = now.getDay();
    const outTimestamp = now.getTime();
    const out = await Studytime.create({ email, outTime, day, outTimestamp });

    const inTime = await Studytime.find({ email }, { inTimestamp: 1, email: 1 });
    const outTime_1 = await Studytime.find({ email }, { outTimestamp: 1, email: 1 });
    const allinTime = inTime.map((intime) => intime.inTimestamp).filter((intime) => intime !== undefined);
    const arr_allinTime = allinTime[allinTime.length - 1]; //맨마지막타임스타드
    const alloutTime = outTime_1.map((outtime) => outtime.outTimestamp).filter((outtime) => outtime !== undefined);
    const arr_alloutTime = alloutTime[alloutTime.length - 1]; //맨마지막타임아웃
    const timedif = arr_alloutTime - arr_allinTime;
    const finaltime = changeTime(timedif);
    console.log('hi');
    await Studytime.updateOne({ outTimestamp: arr_alloutTime }, { $set: { studytime: finaltime, timedif: timedif } });
    await Studytime.updateOne({ inTimestamp: arr_allinTime }, { $set: { studytime: finaltime, timedif: timedif } });

    // todayRecord
    // TotalstudyTime, +1은 다음날을 기준으로 하기위해서 한것이고 -9시간은 UTC와 KRA 시간이 달라서 조정하기 위해 뺀것!!
    const today = new Date(todayStart);
    const tommorownum = today.getTime() + 24 * 60 * 60 * 1000 - 9 * 60 * 60 * 1000;
    const todayKST = today.getTime() - 9 * 60 * 60 * 1000;
    const todaytime_1 = await Studytime.find({ email, inTimestamp: { $gt: todayKST, $lt: tommorownum } });
    const todaytime_2 = todaytime_1.map((x) => x.timedif).filter((x) => x !== undefined);
    let todaysum = 0;
    for (let i = 0; i < todaytime_2.length; i++) {
      todaysum += todaytime_2[i];
    }
    console.log(changeTime(todaysum));

    await Studytime.updateOne(
      { outTimestamp: arr_alloutTime },
      { $set: { todaysum: changeTime(todaysum), todaysum_h: timeConversion(todaysum) } },
    );
    await Studytime.updateOne(
      { inTimestamp: arr_allinTime },
      { $set: { todaysum: changeTime(todaysum), todaysum_h: timeConversion(todaysum) } },
    );

    return res.status(201).send({
      groupNum,
      result: true,
      msg: '스터디 룸에서 나왔습니다.',
      out,
      todayrecord: changeTime(todaysum),
      todaysum_h: timeConversion(todaysum),
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
    if (!userId) {
      return res.status(401).send({
        result: false,
        msg: '방의 호스트만 삭제할 수 있습니다.',
      });
    }
    await Room.deleteOne({ roomId });
    return res.status(201).send({ result: true, msg: '스터디 룸이 삭제되었습니다.' });
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

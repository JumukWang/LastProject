require('dotenv').config();
const { User, Day, Studytime, Room } = require('../models');
const Bcrypt = require('bcrypt');
const config = require('../config');
const { daySet } = require('../routes/studytime');
const { profileDelete } = require('../middlewares/upload');

async function mypage(req, res) {
  try {
    const { userId } = req.params;
    const myPage = await User.findOne({ userId }, { userLike: 0, attendRoom: 0, hostRoom: 0 });
    const { userLike, attendRoom, hostRoom } = await User.findOne({ userId }).sort('-createAt');

    let flat1 = [];
    for (let i in userLike) {
      if (await Room.find({ roomId: userLike[i] })) {
        flat1.push(await Room.find({ roomId: userLike[i] }));
      }
    }
    const likeInfo = flat1.flat(1);

    let flat2 = [];
    for (let i in attendRoom) {
      if (await Room.find({ roomId: attendRoom[i] })) {
        flat2.push(await Room.find({ roomId: attendRoom[i] }));
      }
    }
    const attendInfo = flat2.flat(1);

    let flat3 = [];
    for (let i in hostRoom) {
      if (await Room.find({ roomId: hostRoom[i] })) {
        flat3.push(await Room.find({ roomId: hostRoom[i] }));
      }
    }
    const hostInfo = flat3.flat(1);

    return res.status(200).send({
      result: true,
      myPage,
      likeInfo,
      likeInfoLength: likeInfo.length,
      attendInfo,
      attendInfoLength: attendInfo.length,
      hostInfo,
      hostInfoLength: hostInfo.length,
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: error.message,
    });
  }
}

async function mypageUpdate(req, res) {
  const userId = Number(req.params.userId);
  const findUser = await User.findOne({ userId });
  console.log(findUser);
  const { nickname, password, passwordCheck } = req.body;
  try {
    const user = await User.findOne({ userId: Number(userId) });
    console.log(user);
    if (passwordCheck !== password) {
      return res.send({
        result: false,
        msg: '비밀번호, 비밀번호 확인이 동일해야 합니다.',
      });
    }
    const salt = await Bcrypt.genSalt(Number(config.SALT_NUM));
    const hashPassword = await Bcrypt.hash(password, salt);

    const newprofileUrl = req.file; //추가
    console.log(newprofileUrl);
    if (newprofileUrl) {
      profileDelete(findUser.profile_url);
      await User.updateOne(
        { userId },
        {
          $set: { nickname, password: hashPassword, passwordCheck, profile_url: newprofileUrl.transforms[0].location },
        },
      );
      const updateUser = await User.findOne({ userId: Number(userId) });
      res.send({
        result: true,
        msg: '유저정보가 수정되었습니다.',
        updateUser,
      });
    } else {
      await User.updateOne({ userId }, { $set: { nickname, password: hashPassword, passwordCheck } });
      const updateUser = await User.findOne({ userId: Number(userId) });
      res.send({
        result: true,
        msg: '유저정보가 수정되었습니다.',
        updateUser,
      });
    }
  } catch (error) {
    res.status(400).send({
      result: false,
      msg: error.message,
    });
  }
}

async function userSearch(req, res) {
  try {
    const users = await User.find({}, { userId: 1, nickname: 1, email: 1 });
    console.log(users);
    return res.status(200).json({
      result: true,
      users,
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '유저정보를 불러올 수 없습니다.',
      errmsg: error.message,
    });
  }
}

async function mypageTimeGraph(req, res) {
  const userId = Number(req.params.userId);
  const email = req.email;
  try {
    const days = await Day.find({ userId });
    const now = new Date();
    const day = now.getDay();

    if (days.length === 0) {
      await Day.create({ userId });
    }
    if (day) {
      const dayAll = await Studytime.find({ email, day: day });
      const dayOne = dayAll.slice(-1)[0];

      if (dayOne.day === 0) {
        await Day.updateOne({ userId }, { $set: { day0: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      if (dayOne.day === 1) {
        await Day.updateOne({ userId }, { $set: { day1: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      if (dayOne.day === 2) {
        await Day.updateOne({ userId }, { $set: { day2: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      if (dayOne.day === 3) {
        await Day.updateOne({ userId }, { $set: { day3: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      if (dayOne.day === 4) {
        await Day.updateOne({ userId }, { $set: { day4: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      if (dayOne.day === 5) {
        await Day.updateOne({ userId }, { $set: { day5: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      if (dayOne.day === 6) {
        await Day.updateOne({ userId }, { $set: { day6: { day: daySet(dayOne.day), time: dayOne.todaysum_h } } });
      }
      const [days_1] = await Day.find({ userId });
      const [Sun] = days_1.day0;
      const [Mon] = days_1.day1;
      const [Tue] = days_1.day2;
      const [Wed] = days_1.day3;
      const [Thur] = days_1.day4;
      const [Fri] = days_1.day5;
      const [Sat] = days_1.day6;

      let studytime = [];
      studytime.push(Sun, Mon, Tue, Wed, Thur, Fri, Sat);

      return res.status(200).send({
        studytime,
      });
    }
  } catch (error) {
    res.status(400).send({
      result: false,
      msg: error.msg,
    });
  }
}

module.exports = {
  mypage,
  mypageTimeGraph,
  mypageUpdate,
  userSearch,
};

const { Room, User, Studytime } = require('../models');
const { timeSet, changeTime, timeConversion } = require('./studytime');
const moment = require('moment');
// 메인 페이지 만들기
async function roomCreate(req, res) {
  try {
    const { tagName, title, content, password, date, lock } = req.body;
    const roomUrl = req.file; //추가
    const host = Number(req.params.userId);

    if (roomUrl) {
      const imgFile = await roomUrl.transforms[0].location; //추가
      let stringTag = tagName.toString();
      const arrTag = stringTag.split(',');
      if (lock === 'false') {
        let flag = false;
        const newPublicRoom = await Room.create({
          title,
          content,
          date,
          tagName: arrTag,
          imgUrl: imgFile,
          lock: flag,
        });
        await newPublicRoom.save();
        const roomNum = Number(newPublicRoom.roomId);
        await Room.updateOne({ roomId: roomNum }, { $set: { hostId: host } });
        await User.updateOne({ userId: host }, { $push: { hostRoom: roomNum } });
        return res.status(201).send({ msg: '스터디룸을 생성하였습니다.', roomInfo: newPublicRoom });
      }
      if (lock === 'true') {
        let flag = true;
        const newPrivaeRoom = await Room.create({
          title,
          password,
          content,
          date,
          tagName: arrTag,
          imgUrl: imgFile,
          lock: flag,
        });
        const roomNum = Number(newPrivaeRoom.roomId);
        await Room.updateOne({ roomId: roomNum }, { $set: { hostId: host } });
        await User.updateOne({ userId: host }, { $push: { hostRoom: roomNum } });
        return res.status(201).send({ msg: '스터디룸을 생성하였습니다.', roomInfo: newPrivaeRoom });
      }
    } else {
      let stringTag = tagName.toString();
      const arrTag = stringTag.split(',');
      if (lock === 'false') {
        let flag = false;
        const newPublicRoom = await Room.create({
          title,
          content,
          date,
          tagName: arrTag,
          imgUrl: 'https://lastproject01.s3.ap-northeast-2.amazonaws.com/uploadRoom/3421659600578248.png',
          lock: flag,
        });
        await newPublicRoom.save();
        const roomNum = Number(newPublicRoom.roomId);
        await Room.updateOne({ roomId: roomNum }, { $set: { hostId: host } });
        await User.updateOne({ userId: host }, { $push: { hostRoom: roomNum } });
        return res.status(201).send({ msg: '스터디룸을 생성하였습니다.', roomInfo: newPublicRoom });
      }
      if (lock === 'true') {
        let flag = true;
        const newPrivaeRoom = await Room.create({
          title,
          password,
          content,
          date,
          tagName: arrTag,
          imgUrl: 'https://lastproject01.s3.ap-northeast-2.amazonaws.com/uploadRoom/3421659600578248.png',
          lock: flag,
        });
        const roomNum = Number(newPrivaeRoom.roomId);
        await Room.updateOne({ roomId: roomNum }, { $set: { hostId: host } });
        await User.updateOne({ userId: host }, { $push: { hostRoom: roomNum } });
        return res.status(201).send({ msg: '스터디룸을 생성하였습니다.', roomInfo: newPrivaeRoom });
      }
    }
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디를 생성하지 못했습니다.',
      errmsg: error.message,
    });
  }
}

async function publicRoom(req, res) {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    const { groupNum, title, attendName } = await Room.findOne({ roomId: roomId });
    const { nickname } = await User.findOne({ userId: userId });
    if (groupNum.length >= 4) {
      return res.status(400).send({
        result: false,
        msg: '정원이 초과되었습니다.',
      });
    }

    await Room.updateOne({ roomId: roomId }, { $push: { groupNum: userId } });
    await Room.updateOne({ roomId: roomId }, { $push: { attendName: nickname } });
    await User.updateOne({ userId: userId }, { $push: { attendRoom: roomId } });
    const roomInfo = await Room.findOne({ roomId: roomId }); //정보 최신화

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
        groupNum: roomInfo.groupNum,
        attendNum: attendName.length,
        start,
        email: total.email,
        day: total.day,
        hour: 0,
        minute: 0,
        second: 0,
        todayrecord: 0,
        weekrecord: 0,
        msg: `'${title}'에 입장하였습니다.`,
      });
    } else {
      const lasttotal = total.slice(-2)[0];
      let hour = lasttotal.todaysum.substr(0, 2);
      let minute = lasttotal.todaysum.substr(3, 2);
      let second = lasttotal.todaysum.substr(6, 2);

      return res.status(200).send({
        roomId,
        title,
        groupNum: roomInfo.groupNum,
        attendNum: attendName.length,
        email: lasttotal.email,
        day: lasttotal.day,
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        todayrecord: lasttotal.todaysum,
        weekrecord: lasttotal.weeksum,
        msg: `'${title}'에 입장하였습니다.`,
      });
    }
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디에 입장할 수 없습니다.',
      errmsg: error.message,
    });
  }
}

async function privateRoom(req, res) {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    const { password } = req.body;
    const passCheck = await Room.findOne({ roomId: roomId });
    const { groupNum, title, attendName } = await Room.findOne({ roomId: roomId });
    const { nickname } = await User.findOne({ userId: userId });
    const checkName = attendName.includes(nickname);
    //패스워드 체크
    if (!password) {
      return res.status(400).json({ result: false, msg: '비밀번호를 입력해주세요.' });
    }
    if (Number(passCheck.password) !== Number(password)) {
      return res.status(401).send({ msg: '비밀번호가 틀렸습니다 ' });
    }
    //이미 참여인원이면 실시간 인원수만 추가
    if (checkName === true) {
      if (groupNum.length >= 4) {
        return res.status(400).send({
          result: false,
          msg: '정원이 초과되었습니다.',
        });
      }
      await Room.updateOne({ roomId: roomId }, { $push: { groupNum: userId } });

      //시간
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
          attendNum: attendName.length,
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
        let hour = lasttotal.todaysum.substr(0, 2);
        let minute = lasttotal.todaysum.substr(3, 2);
        let second = lasttotal.todaysum.substr(6, 2);

        return res.status(200).send({
          roomId,
          title,
          groupNum,
          attendNum: attendName.length,
          email: lasttotal.email,
          day: lasttotal.day,
          hour: Number(hour),
          minute: Number(minute),
          second: Number(second),
          todayrecord: lasttotal.todaysum,
          weekrecord: lasttotal.weeksum,
          msg: `'${title}'에 입장하였습니다.`,
        });
      }
    }

    //미참여인원은 참여정원확인 후 입장
    if (attendName.length >= 4) {
      return res.status(400).send({
        result: false,
        msg: '정원이 초과되었습니다.',
      });
    }
    await Room.updateOne({ roomId: roomId }, { $push: { groupNum: userId } });
    await Room.updateOne({ roomId: roomId }, { $push: { attendName: nickname } });
    const roomInfo = await Room.findOne({ roomId: roomId }); //정보 최신화
    await User.updateOne({ userId: userId }, { $push: { attendRoom: roomId } });

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
        groupNum: roomInfo.groupNum,
        attendNum: attendName.length,
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
        groupNum: roomInfo.groupNum,
        attendNum: attendName.length,
        email: lasttotal.email,
        day: lasttotal.day,
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        todayrecord: lasttotal.todaysum,
        weekrecord: lasttotal.weeksum,
        msg: `'${title}'에 입장하였습니다.`,
      });
    }
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디에 입장할 수 없습니다.',
      errmsg: error.message,
    });
  }
}

async function roomExit(req, res) {
  try {
    const userId = Number(req.params.userId);
    const roomId = Number(req.params.roomId);
    const { groupNum, lock, attendName } = await Room.findOne({ roomId: roomId });
    const { nickname } = await User.findOne({ userId: userId });

    if (groupNum.length <= 0) {
      return res.status(400).send({
        result: false,
        msg: '참여 인원이 없습니다.',
      });
    }
    if (lock === true) {
      await Room.updateOne({ roomId: roomId }, { $pull: { groupNum: userId } });
      await User.findOneAndUpdate({ userId }, { $pull: { attendRoom: roomId } });
      const roomInfo = await Room.findOne({ roomId: roomId });

      //시간저장
      const email = req.email;

      const { todayStart } = timeSet();
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

      return res.status(400).json({
        groupNum: roomInfo.groupNum,
        attendNum: attendName.length,
        result: true,
        msg: '스터디 룸에서 나왔습니다.',
        out,
        todayrecord: changeTime(todaysum),
        todaysum_h: timeConversion(todaysum),
      });
    }

    //lock === false면 (공개방이면)
    await Room.updateOne({ roomId: roomId }, { $pull: { groupNum: userId } });
    await Room.findOneAndUpdate({ roomId }, { $pull: { attendName: nickname } });
    await User.findOneAndUpdate({ userId }, { $pull: { attendRoom: roomId } });

    //시간저장
    const email = req.email;

    const { todayStart } = timeSet();
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
      attendNum: attendName.length,
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
}

async function deleteRoom(req, res) {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(401).send({
        result: false,
        msg: '방의 호스트만 삭제할 수 있습니다.',
      });
    }

    await Room.deleteOne({ roomId: roomId });
    await User.findOneAndUpdate({ userId }, { $pull: { hostRoom: roomId } });
    await User.updateMany({}, { $pull: { attendRoom: roomId } });

    return res.status(201).send({ result: true, msg: '스터디 룸이 삭제되었습니다.' });
  } catch (error) {
    return res.status(401).send({
      result: false,
      msg: '스터디룸 삭제에 실패하였습니다.',
      errmsg: error.message,
    });
  }
}

async function searchRoom(req, res) {
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
      result: true,
      roomArr,
    });
  } catch (error) {
    return res.status(401).json({ result: false, msg: '찾으시는 스터디가 없습니다.' });
  }
}

async function userLikeRoom(req, res) {
  try {
    const userId = Number(req.params.userId);
    const { userLike } = await User.findOne({ userId }).sort('-createAt');
    let flat = [];
    for (let i in userLike) {
      if (await Room.find({ roomId: userLike[i] })) {
        flat.push(await Room.find({ roomId: userLike[i] }));
      }
    }
    const likeInfo = flat.flat(1);
    return res.status(200).json({
      result: true,
      likeInfo,
      quantity: likeInfo.length,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
}

async function enteredRoom(req, res) {
  try {
    const userId = Number(req.params.userId);
    const { attendRoom } = await User.findOne({ userId }).sort('-createAt');
    let flat = [];
    for (let i in attendRoom) {
      if (await Room.find({ roomId: attendRoom[i] })) {
        flat.push(await Room.find({ roomId: attendRoom[i] }));
      }
    }
    const attendInfo = flat.flat(1);
    return res.status(200).json({
      result: true,
      attendInfo,
      quantity: attendRoom.length,
    });
  } catch (error) {
    res.status(400).send({ errorMessage: error.message });
  }
}

async function hostRoom(req, res) {
  try {
    const userId = Number(req.params.userId);
    const { hostRoom } = await User.findOne({ userId }).sort('-createAt');
    let flat = [];
    for (let i in hostRoom) {
      if (await Room.find({ roomId: hostRoom[i] })) {
        flat.push(await Room.find({ roomId: hostRoom[i] }));
      }
    }
    const hostInfo = flat.flat(1);
    return res.status(200).json({
      result: true,
      hostInfo,
      quantity: hostRoom.length,
    });
  } catch (error) {
    res.status(400).send({ errorMessage: error.message });
  }
}

async function roomInfo(req, res) {
  try {
    const { roomId } = req.params;
    const checkRoom = await Room.findOne({ roomId: roomId });
    if (!checkRoom) {
      return res.status(400).json({ result: false, msg: '방을 찾을 수 없습니다.' });
    }
    const { attendName } = await Room.findOne({ roomId: roomId });

    //참여인원 프로필사진 각각 매칭해서 출력하기
    //방에 참여중인 인원만 파악해서 출력
    let attendInfo = [];
    for (let i in attendName) {
      if (await User.find({ nickname: attendName[i] })) {
        attendInfo.push(await User.find({ nickname: attendName[i] }));
      }
    }
    //위 조건의 결과를 이중for문으로 뽑아내고,
    //동적인 key값을 적용시켜 출력 ex) output: {aa:bb}
    let output = [];
    let nick = 'nickname';
    let image = 'imageUrl';
    for (let i in attendInfo) {
      for (let j in attendInfo[i]) {
        const aa = attendInfo[i][j].nickname;
        const bb = attendInfo[i][j].profile_url;
        let something = {};
        something[nick] = aa;
        something[image] = bb;
        output.push(something);
      }
    }

    return res.status(200).json({
      result: true,
      checkRoom,
      attendNum: attendName.length,
      output,
    });
  } catch (error) {
    res.status(400).send({ result: false, errorMessage: error.message });
  }
}

async function outRoom(req, res) {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    const { groupNum, title, attendName, hostId } = await Room.findOne({ roomId: roomId });
    const { nickname } = await User.findOne({ userId: userId });
    const checkName = attendName.includes(nickname);

    if (hostId === userId) {
      await Room.findOneAndDelete({ roomId }, { hostId: userId });
      await User.findOneAndUpdate({ userId }, { $pull: { hostRoom: roomId } });
      await User.updateMany({}, { $pull: { attendRoom: roomId } });
      return res.status(200).json({ result: true, msg: '호스트인 스터디룸을 탈퇴 하였습니다.' });
    }

    if (checkName === false) {
      return res.status(400).json({ result: false, msg: '참여중인 룸이 아닙니다.' });
    }
    if (groupNum <= 0) {
      return res.status(400).json({ result: false, msg: '참여 인원이 없습니다.' });
    }

    await Room.updateOne({ roomId: roomId }, { $pull: { groupNum: userId } });
    await Room.findOneAndUpdate({ roomId }, { $pull: { attendName: nickname } });
    await User.findOneAndUpdate({ userId }, { $pull: { attendRoom: roomId } });

    return res.status(200).json({
      result: true,
      msg: `${title} 스터디룸을 탈퇴 하였습니다.`,
    });
  } catch (error) {
    res.status(400).send({ result: false, errorMessage: error.message });
  }
}

module.exports = {
  roomCreate,
  roomExit,
  roomInfo,
  outRoom,
  hostRoom,
  enteredRoom,
  userLikeRoom,
  searchRoom,
  deleteRoom,
  privateRoom,
  publicRoom,
};

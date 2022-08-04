require('dotenv').config();
const roomData = require('../models/studyroom');
const userData = require('../models/user');

async function main(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 6);
    const roomLength = await roomData.allRoomList();
    const mainLength = roomLength.length;
    // 더 보기 한번 누를때마다 게시물 6개씩 요청
    const roomList = await roomData.mainRoomList(perPage, page);

    return res.status(200).json({
      result: true,
      roomList,
      mainLength,
    });
  } catch (error) {
    return res.status(400).send({
      result: false,
      msg: '스터디를 불러올 수 없습니다.',
      errmsg: error.message,
    });
  }
}

async function roomLike(req, res) {
  try {
    const roomId = Number(req.params.roomId);
    const userId = Number(req.params.userId);
    const { likeUser, title } = await roomData.roomNumber(roomId);

    let likeStatus = '';
    let msg = '';

    //해당 방안에 내 아이디 유무확인
    if (!likeUser.includes(userId)) {
      await roomData.roomLikeUserUpdate(roomId, userId);
      await userData.userRoomLike(userId, roomId);
      likeStatus = true;
      msg = `${title}방을 찜 했어요!`;
    } else {
      await roomData.roomdisLikeUserUpdate(roomId, userId);
      await userData.userRoomLike(userId, roomId);
      likeStatus = false;
      msg = `${title}방 찜 해제`;
    }
    const [user] = await roomData.allRoomList(roomId);
    const likedUser = user.likeUser;
    return res.status(201).send({
      result: true,
      likeUser: likedUser,
      likeStatus: likeStatus,
      msg: msg,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
}

async function roomCategory(req, res) {
  try {
    const { tagName } = req.params;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 6);
    const roomLength = await roomData.roomTagLength(tagName);
    const tagLength = roomLength.length;
    const roomList = await roomData.roomTagName(tagName, perPage, page);
    res.status(200).json({
      result: true,
      roomList,
      tagLength,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: error.message });
  }
}

module.exports = {
  roomCategory,
  roomLike,
  main,
};

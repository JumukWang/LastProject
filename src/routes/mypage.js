require('dotenv').config();
const router = require('express').Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { User } = require('../models');
const Bcrypt = require('bcrypt');
const { logging } = require('../middlewares');
const SALT_NUM = process.env.SALT_NUM;

// 마이페이지
router.get('/:userId', logging, authMiddleware, async (req, res) => {
  const userId = Number(req.params.userId);
  const user = await User.findOne({ userId: Number(userId) });
  try {
    const myPage = await User.findOne({ user });
    res.status(200).send({
      result: true,
      myPage,
    });
  } catch (error) {
    res.status(400).send({
      result: false,
      message: error.message,
    });
  }
});

// 마이페이지수정
router.put('/:userId/update', logging, authMiddleware, async (req, res) => {
  const userId = Number(req.params.userId);
  const { nickname, password, passwordCheck, imgUrl } = req.body;
  try {
    const user = await User.findOne({ userId: Number(userId) });
    console.log(user);
    if (passwordCheck !== password) {
      return res.send({
        result: false,
        message: '비밀번호, 비밀번호 확인이 동일해야 합니다.',
      });
    }

    const salt = await Bcrypt.genSalt(Number(SALT_NUM));
    const hashPassword = await Bcrypt.hash(password, salt);

    await User.updateOne({ userId }, { $set: { nickname, password: hashPassword, passwordCheck, imgUrl } });
    const updateUser = await User.findOne({ userId: Number(userId) });
    res.send({
      result: true,
      message: '유저정보가 수정되었습니다.',
      updateUser,
    });
  } catch (error) {
    res.status(400).send({
      result: false,
      message: error.message,
    });
  }
});

// 유저찾기

router.get('/search', async (req, res) => {
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
});

module.exports = router;

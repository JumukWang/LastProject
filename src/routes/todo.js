require('dotenv').config();
const router = require('express').Router();
const Todo = require('../models/todo');
const authMiddleware = require('../middlewares/authmiddleware');

const moment = require('moment');

//할 일 목록
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const todos = await Todo.find({ roomId }).sort('-createAt').exec();
    if (!todos) {
      return res.status(400).json({
        success: false,
        errorMessage: '할 일 목록이 없습니다.',
      });
    }
    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
});

//할 일 생성
router.post('/input/:roomId', authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const { text, todoId } = req.body;
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const todo = await Todo.create({
      roomId: Number(roomId),
      todoId,
      text: text,
      date: date,
    });

    if (!text) {
      return res.status(401).json({ success: false, errorMessage: '빈 칸을 채워주세요.' });
    }
    if (!todo) {
      return res.status(401).json({ success: false, errorMessage: '할 일 생성 오류' });
    }

    res.status(201).json({
      success: true,
      todo,
      msg: '할 일 목록 추가',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
});

//할 일 삭제
router.delete('/remove/:roomId', authMiddleware, async (req, res) => {
  try {
    const todoId = Number(req.params.roomId);
    const deleteTodo = await Todo.findOne({ todoId });
    if (!todoId) {
      return res.status(400).json({ success: false, errorMessage: 'todoId를 찾을 수 없습니다.' });
    }
    if (!deleteTodo) {
      return res.status(400).json({ success: false, errorMessage: '삭제 할 목록이 없습니다.' });
    }

    await Todo.deleteOne({ todoId });
    res.status(200).json({
      success: true,
      msg: '할 일 목록이 삭제 되었습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
});

module.exports = router;

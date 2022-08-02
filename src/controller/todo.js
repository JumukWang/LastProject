require('dotenv').config();
const Todo = require('../models/todo');


const moment = require('moment');

async function getList(req, res) {
  try {
    const roomId = Number(req.params.roomId);
    const todos = await Todo.find({ roomId }).sort('-createAt').exec();
    if (!todos) {
      return res.status(400).json({
        result: false,
        errorMessage: '할 일 목록이 없습니다.',
      });
    }
    res.status(200).json({
      result: true,
      todos,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
}

async function postList(req, res) {
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
    await todo.save();
    if (!text) {
      return res.status(401).json({ result: false, errorMessage: '빈 칸을 채워주세요.' });
    }
    if (!todo) {
      return res.status(401).json({ result: false, errorMessage: '할 일 생성 오류' });
    }

    const todos = await Todo.findOne({ todoId: todoId }).sort('-createAt').exec();
    res.status(201).json({
      result: true,
      todos,
      msg: '할 일 목록 추가',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
}

async function updateList(req, res) {
  try {
    const todoId = Number(req.params.todoId);
    const { text, checkBox } = req.body;
    const check = await Todo.findOne({ todoId: todoId });
    if (!check) {
      return res.status(400).json({ result: false, msg: 'todo가 없습니다.' });
    }

    await Todo.updateOne({ todoId }, { $set: { checkBox: checkBox } });
    await Todo.updateOne({ todoId }, { $set: { text: text } });

    const todos = await Todo.findOne({ todoId: todoId }).sort('-createAt').exec();
    res.status(200).json({
      result: true,
      todos,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
}

async function deleteList(req, res) {
  try {
    const todoId = Number(req.params.todoId);
    const deleteTodo = await Todo.findOne({ todoId });
    if (!todoId) {
      return res.status(400).json({ result: false, errorMessage: 'todoId를 찾을 수 없습니다.' });
    }
    if (!deleteTodo) {
      return res.status(400).json({ result: false, errorMessage: '삭제 할 목록이 없습니다.' });
    }

    await Todo.deleteOne({ todoId });
    res.status(200).json({
      result: true,
      msg: '할 일 목록이 삭제 되었습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errorMessage: error.message });
  }
}

module.exports = { getList, postList, updateList, deleteList };

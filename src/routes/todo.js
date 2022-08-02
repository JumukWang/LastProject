require('dotenv').config();
const router = require('express').Router();
const authMiddleware = require('../middlewares/authmiddleware');
const listController = require('../controller/todo');

//할 일 목록
router.get('/:roomId', authMiddleware, listController.getList);

//할 일 생성
router.post('/input/:roomId', authMiddleware, listController.postList);

//할 일 수정
router.put('/:todoId', authMiddleware, listController.updateList);

//할 일 삭제
router.delete('/remove/:todoId', authMiddleware, listController.deleteList);

module.exports = router;

require('dotenv').config();
const router = require('express').Router();
const mainController = require('../controller/main');
const authMiddleware = require('../middlewares/authmiddleware');

// 메인 페이지
router.get('/', mainController.main);

// 좋아요
router.post('/like/:roomId/:userId', authMiddleware, mainController.roomLike);

//카테고리
router.get('/tag/:tagName', mainController.roomCategory);

module.exports = router;

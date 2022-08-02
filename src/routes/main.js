require('dotenv').config();
const router = require('express').Router();
const mainController = require('../controller/main');

// 메인 페이지
router.get('/', mainController.main);

// 좋아요
router.post('/like/:roomId/:userId', mainController.roomLike);

//카테고리
router.get('/tag/:tagName', mainController.roomCategory);

module.exports = router;

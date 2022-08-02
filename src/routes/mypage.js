require('dotenv').config();
const router = require('express').Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { profileUpload } = require('../middlewares/upload');
const myPageController = require('../controller/mypage');

// 마이페이지
router.get('/:userId', authMiddleware, myPageController.mypage);

// 마이페이지수정
router.put('/:userId/update', authMiddleware, profileUpload.single('profile_url'), myPageController.mypageUpdate);
// 유저찾기

router.get('/search', myPageController.userSearch);

// 마이페이지 Study Time,day 조회
router.get('/:userId/time', authMiddleware, myPageController.mypageTimeGraph);

module.exports = router;

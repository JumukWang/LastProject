const router = require('express').Router();
const { profileUpload } = require('../middlewares/upload');
const { validateNick, validatePwd } = require('../middlewares/validation');
const authController = require('../controller/auth');

// 회원가입
router.post('/signup', profileUpload.single('profile_url'), authController.signup);

// 로그인
router.post('/login', validatePwd, authController.login);

// 닉네임 중복검사
router.post('/exnickname', validateNick, authController.exnickname);

module.exports = router;

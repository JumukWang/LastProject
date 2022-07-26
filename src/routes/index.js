const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./mypage');
const roomRouter = require('./room');
const todoRouter = require('./todo');
const mainRouter = require('./main');
const kakaoRouter = require('./kakaoAuth');
const googleRouter = require('./googleAuth');
const authMail = require('./authMail');
const studytimeRouter = require('/studytime');
const { logging } = require('../middlewares');

router.use('/auth', logging, authRouter);
router.use('/mypage', logging, userRouter);
router.use('/room', logging, roomRouter);
router.use('/todo', logging, todoRouter);
router.use('/studytime', logging, studytimeRouter);
router.use('/main', logging, mainRouter);
router.use('/kakao', logging, kakaoRouter);
router.use('/google', logging, googleRouter);
router.use('/authMail', logging, authMail);

module.exports = router;

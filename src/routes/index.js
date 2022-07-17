const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./mypage');
const roomRouter = require('./room');
const todoRouter = require('./todo');
const studytimeRouter = require('./studytime');
const mainRouter = require('./main');
const kakaoRouter = require('./kakaoAuth');
const googleRouter = require('./googleAuth');

router.use('/auth', authRouter);
router.use('/mypage', userRouter);
router.use('/room', roomRouter);
router.use('/todo', todoRouter);
router.use('/studytime', studytimeRouter);
router.use('/main', mainRouter);
router.use('/kakao', kakaoRouter);
router.use('/google', googleRouter);

module.exports = router;

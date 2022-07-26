const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./mypage');
const roomRouter = require('./room');
const todoRouter = require('./todo');
const mainRouter = require('./main');
const mailAuthRouter = require('./mailauth');

router.use('/auth', authRouter);
router.use('/mypage', userRouter);
router.use('/room', roomRouter);
router.use('/todo', todoRouter);
router.use('/main', mainRouter);
router.use('/mailauth', mailAuthRouter);

module.exports = router;

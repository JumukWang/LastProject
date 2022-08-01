const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./mypage');
const roomRouter = require('./room');
const todoRouter = require('./todo');
const mainRouter = require('./main');
const authMail = require('./authMail');
const { logging } = require('../middlewares');

router.use('/auth', logging, authRouter);
router.use('/mypage', logging, userRouter);
router.use('/room', logging, roomRouter);
router.use('/todo', logging, todoRouter);
router.use('/main', logging, mainRouter);
router.use('/authMail', logging, authMail);

module.exports = router;

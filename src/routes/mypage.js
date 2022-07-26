require("dotenv").config()
const router = require("express").Router();
const authMiddleware = require("../middlewares/authmiddleware")
const { User, Studytime, Day } = require('../models');
const Bcrypt = require("bcrypt");
const { pushArgumentsWithLength } = require("@redis/search/dist/commands");
const SALT_NUM = process.env.SALT_NUM
const moment = require("moment");
const { daySet } = require('../routes/studytime');
const { upload } = require('../middlewares/upload')

// 마이페이지
router.get('/:userId', authMiddleware, async (req, res) => {
    const userId = Number(req.params.userId)
    const user = await User.findOne({ userId: Number(userId) });
    try {
        const myPage = await User.findOne({ user });
        res.status(200).send({ 
            result: true,
            myPage
        });
    } catch (error) {
        res.status(400).send({
            result: false,
            msg: error.message,
        });
    }
});

// 마이페이지수정
router.put('/:userId/update', authMiddleware, async (req, res) => {
    const userId = Number(req.params.userId)
    const { nickname, password, passwordCheck, imgUrl } = req.body;
    try {
        // const file = await req.file;
        // const imgUrl = await file.location;
        const user = await User.findOne({ userId: Number(userId) });
        
        if (passwordCheck !== password) {
            return res.send({
                result: false,
                msg: "비밀번호, 비밀번호 확인이 동일해야 합니다."
            })
        }
        
        const salt = await Bcrypt.genSalt(Number(SALT_NUM))
        const hashPassword = await Bcrypt.hash(password, salt)

        await User.updateOne({ userId }, 
            { $set: { nickname, password:hashPassword , passwordCheck, imgUrl }});
            const updateUser = await User.findOne({ userId: Number(userId) });
            res.send({
                result: true,
                message: "유저정보가 수정되었습니다.",
                updateUser,
                // imgUrl
        })
    } catch (error) {
        res.status(400).send({
            result: false,
            msg: error.msg,
        });
    }
});

// 유저찾기

router.get('/search', async (req, res, next) => {
    try {
        const users = await User.find({}, {userId: 1, nickname: 1, email:1});
        console.log(users)
            return res.status(200).json({
                result: true,
                users,
        });
    } catch(error) {
        return res.status(400).send({
            result: false,
            msg: "유저정보를 불러올 수 없습니다.",
            errmsg: error.message,
          })
    }
});

// 마이페이지 Study Time,day 조회
router.get('/:userId/time',authMiddleware, async (req, res) => {
    const userId = Number(req.params.userId) 
    const email = req.email
    try{
        const days = await Day.find({userId})
        const now = new Date();
        const day = now.getDay();

        if(days.length === 0){
            await Day.create({userId})
        } 
        if(day) {
            const dayAll = await Studytime.find({email,day:day})
            const dayOne = dayAll.slice(-1)[0]
            

            if(dayOne.day === 0) {
                await Day.updateOne({userId}, { $set: { day0 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            } if (dayOne.day === 1) {
                await Day.updateOne({userId}, { $set: { day1 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            } if (dayOne.day === 2) {
                await Day.updateOne({userId}, { $set: { day2 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            } if (dayOne.day === 3) {
                await Day.updateOne({userId}, { $set: { day3 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            } if (dayOne.day === 4) {
                await Day.updateOne({userId}, { $set: { day4 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            } if (dayOne.day === 5) {
                await Day.updateOne({userId}, { $set: { day5 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            } if (dayOne.day === 6) {
                await Day.updateOne({userId}, { $set: { day6 : { day: daySet(dayOne.day), time: dayOne.todaysum_h}}})
            }
            const [ days_1 ]  = await Day.find({userId})
            const [Sun] = days_1.day0
            const [Mon] = days_1.day1
            const [Tue] = days_1.day2
            const [Wed] = days_1.day3
            const [Thur] = days_1.day4
            const [Fri] = days_1.day5
            const [Sat] = days_1.day6

            let studytime = [];
            studytime.push(Sun, Mon, Tue, Wed, Thur, Fri, Sat)
            
            return res.status(200).send({
                studytime
        })
        }
      } catch (error) {
        res.status(400).send({
          result: false,
          msg: error.msg,
      });
      }
});
  


module.exports = router

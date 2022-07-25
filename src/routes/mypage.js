require("dotenv").config()
const router = require("express").Router();
const authMiddleware = require("../middlewares/authmiddleware")
const { User, Studytime, Day } = require('../models');
const Bcrypt = require("bcrypt");
const { pushArgumentsWithLength } = require("@redis/search/dist/commands");
const SALT_NUM = process.env.SALT_NUM
const moment = require("moment");

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
        const user = await User.findOne({ userId: Number(userId) });
        console.log(user)
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
                updateUser
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
        const total = await Studytime.find({email})
        const day0 = await Studytime.findOne({email, day : 0}).sort({_id:-1})
        const day1 = await Studytime.findOne({email, day : 1}).sort({_id:-1})
        const day2 = await Studytime.findOne({email, day : 2}).sort({_id:-1})
        const day3 = await Studytime.findOne({email, day : 3}).sort({_id:-1})
        const day4 = await Studytime.findOne({email, day : 4}).sort({_id:-1})
        const day5 = await Studytime.findOne({email, day : 5}).sort({_id:-1})
        const day6 = await Studytime.findOne({email, day : 6}).sort({_id:-1}) 
        
        await Day.create({userId})

        let days = total.map(x=> x.day)
        if(days.includes(0)) {
            await Day.updateOne({userId},{ $push : { day0 : day0 }})
        } if(days.includes(1)) {
            await Day.updateOne({userId},{ $push : { day1 : day1 }})
        } if(days.includes(2)) {
            await Day.updateOne({userId},{ $push : { day2 : day2 }})
        } if(days.includes(3)) {
            await Day.updateOne({userId},{ $push : { day3 : day3 }})
        } if(days.includes(4)) {
            await Day.updateOne({userId},{ $push : { day4 : day4 }})
        } if(days.includes(5)) {
            await Day.updateOne({userId},{ $push : { day5 : day5 }})
        } if(days.includes(6)) {
            await Day.updateOne({userId},{ $push : { day6 : day6 }})
        }
        // console.log(day0,day1,day2,day3,day4,day5,day6)

        const q = await Day.find({userId})
        
        const day0_0 = q.map(x=>x.day0).slice(0)[0].slice(-1)[0]
        const day1_1 = q.map(x=>x.day1).slice(0)[0].slice(-1)[0]
        const day2_2 = q.map(x=>x.day2).slice(0)[0].slice(-1)[0]
        const day3_3 = q.map(x=>x.day3).slice(0)[0].slice(-1)[0]
        const day4_4 = q.map(x=>x.day4).slice(0)[0].slice(-1)[0]
        const day5_5 = q.map(x=>x.day5).slice(0)[0].slice(-1)[0]
        const day6_6 = q.map(x=>x.day6).slice(0)[0].slice(-1)[0]

        console.log(day0_0,day1_1,day2_2,day3_3,day4_4,day5_5,day6_6)
        
        // const now = new Date();
        // const day = now.getDay();
        // if(day) {
        //     const b = await Studytime.find({email,day:day})
        //     const c = b.slice(-1)[0]
        //     console.log(c)
        //     await Day.updateOne({userId}, { $push: { day0 : c}})
        // }

        // const day0 = total[total.length-1];
        // console.log(day0)
        // const d = await Day.create({userId})
        
        // cosnole.log(c)
        // if(total.map(x=> x.day).includes(Number(0))) {
        //     await User.updateOne({userId}, { $push: { day0: day0}}) 
        // }
        
        // const lasttotal = total[total.length-1];
        // console.log(lasttotal)
        res.status(200).send({
          result: true,
          Sun : day0_0,
          Mon : day1_1,
          Tue : day2_2,
          Wed : day3_3,
          Thur : day4_4,
          Fri : day5_5,
          Sat : day6_6,
        //   email : lasttotal.email,
        //   day : lasttotal.day,
        //   todayrecord : lasttotal.todaysum,
        //   weekrecord : lasttotal.weeksum
        });
      } catch (error) {
        res.status(400).send({
          result: false,
          msg: error.msg,
      });
      }
});
  


module.exports = router

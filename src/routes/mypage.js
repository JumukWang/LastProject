require("dotenv").config()
const router = require("express").Router();
const authMiddleware = require("../middlewares/authmiddleware")
const { User, Studytime, Day } = require('../models');
const Bcrypt = require("bcrypt");
const { pushArgumentsWithLength } = require("@redis/search/dist/commands");
const SALT_NUM = process.env.SALT_NUM
const moment = require("moment");
const { daySet } = require('../routes/studytime');


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
        // const total = await Studytime.find({email})
        // const day0 = await Studytime.findOne({email, day : 0}).sort({_id:-1})
        // const day1 = await Studytime.findOne({email, day : 1}).sort({_id:-1})
        // const day2 = await Studytime.findOne({email, day : 2}).sort({_id:-1})
        // const day3 = await Studytime.findOne({email, day : 3}).sort({_id:-1})
        // const day4 = await Studytime.findOne({email, day : 4}).sort({_id:-1})
        // const day5 = await Studytime.findOne({email, day : 5}).sort({_id:-1})
        // const day6 = await Studytime.findOne({email, day : 6}).sort({_id:-1}) 
        
        // await Day.create({userId})

        // let days = total.map(x=> x.day)
        // if(days.includes(0)) {
        //     await Day.updateOne({userId},{ $push : { day0 : day0 }})
        // } if(days.includes(1)) {
        //     await Day.updateOne({userId},{ $push : { day1 : day1 }})
        // } if(days.includes(2)) {
        //     await Day.updateOne({userId},{ $push : { day2 : day2 }})
        // } if(days.includes(3)) {
        //     await Day.updateOne({userId},{ $push : { day3 : day3 }})
        // } if(days.includes(4)) {
        //     await Day.updateOne({userId},{ $push : { day4 : day4 }})
        // } if(days.includes(5)) {
        //     await Day.updateOne({userId},{ $push : { day5 : day5 }})
        // } if(days.includes(6)) {
        //     await Day.updateOne({userId},{ $push : { day6 : day6 }})
        // }
        // // console.log(day0,day1,day2,day3,day4,day5,day6)

        // const q = await Day.find({userId})
        
        // const day0_0 = q.map(x=>x.day0).slice(0)[0].slice(-1)[0]
        // const day1_1 = q.map(x=>x.day1).slice(0)[0].slice(-1)[0]
        // const day2_2 = q.map(x=>x.day2).slice(0)[0].slice(-1)[0]
        // const day3_3 = q.map(x=>x.day3).slice(0)[0].slice(-1)[0]
        // const day4_4 = q.map(x=>x.day4).slice(0)[0].slice(-1)[0]
        // const day5_5 = q.map(x=>x.day5).slice(0)[0].slice(-1)[0]
        // const day6_6 = q.map(x=>x.day6).slice(0)[0].slice(-1)[0]
        
        // console.log(day0_0,day1_1,day2_2,day3_3,day4_4,day5_5,day6_6)

        const x = await Day.find({userId})
        const now = new Date();
        const day = now.getDay();

        if(x.length === 0){
            const d = await Day.create({userId})
        } 
        if(day) {
            const b = await Studytime.find({email,day:day})
            const c = b.slice(-1)[0]
            
            // const [ p ]  = await Day.find({userId})
            // console.log(p.day.map(x=>x.day))
            // for(let i=0; i<7; i++) {
            // if(p.day.map(x=>x.day).includes(Number(i))) {
            //     await Day.updateOne({userId}, { $push: { day : { day: c.day, time: c.todaysum_h}}})
            // }
            // }
            if(c.day === 0) {
                await Day.updateOne({userId}, { $set: { day0 : { day: daySet(c.day), time: c.todaysum_h}}})
            } if (c.day === 1) {
                await Day.updateOne({userId}, { $set: { day1 : { day: daySet(c.day), time: c.todaysum_h}}})
            } if (c.day === 2) {
                await Day.updateOne({userId}, { $set: { day2 : { day: daySet(c.day), time: c.todaysum_h}}})
            } if (c.day === 3) {
                await Day.updateOne({userId}, { $set: { day3 : { day: daySet(c.day), time: c.todaysum_h}}})
            } if (c.day === 4) {
                await Day.updateOne({userId}, { $set: { day4 : { day: daySet(c.day), time: c.todaysum_h}}})
            } if (c.day === 5) {
                await Day.updateOne({userId}, { $set: { day5 : { day: daySet(c.day), time: c.todaysum_h}}})
            } if (c.day === 6) {
                await Day.updateOne({userId}, { $set: { day6 : { day: daySet(c.day), time: c.todaysum_h}}})
            }
            const [ k ]  = await Day.find({userId})
            console.log(k)
            console.log(k.day2) 
            const [a1] = k.day0
            const [b1] = k.day1
            const [c1] = k.day2
            const [d1] = k.day3
            const [e1] = k.day4
            const [f1] = k.day5
            const [g1] = k.day6

            let studytime = [];
            studytime.push(a1, b1, c1, d1, e1, f1, g1)
            console.log(studytime)

            return res.status(200).send({
                studytime
        })
        }

        // const day0 = total[total.length-1];
        // console.log(day0)
        // const d = await Day.create({userId})
        
        // cosnole.log(c)
        // if(total.map(x=> x.day).includes(Number(0))) {
        //     await User.updateOne({userId}, { $push: { day0: day0}}) 
        // }

        // const lasttotal = total[total.length-1];
        // console.log(lasttotal)

        
        // res.status(200).send({
        //   result: true,
        //   day0_0,
        //   day1_1,
        //   day2_2,
        //   day3_3,
        //   day4_4,
        //   day5_5,
        //   day6_6,
          
        // //   email : lasttotal.email,
        // //   day : lasttotal.day,
        // //   todayrecord : lasttotal.todaysum,
        // //   weekrecord : lasttotal.weeksum
        // });
      } catch (error) {
        res.status(400).send({
          result: false,
          msg: error.msg,
      });
      }
});
  


module.exports = router

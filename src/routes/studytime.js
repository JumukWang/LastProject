require("dotenv").config()
const { Studytime, User }= require("../models")
const router = require("express").Router()
const authmiddleware = require("../middlewares/authmiddleware");
const moment = require("moment");

// today,week Start Point
function timeSet() {
  // 1. 현재 날짜정보, 오늘 타임스탬프, 오늘 요일 출력
  const now = new Date();
  const nowTimestamp = now.getTime();
  const nowDay = now.getDay();
  const dayToMs = 24 * 60 * 60 * 1000;
  const calcDate = now.getDate() - nowDay + ((nowDay == 0 ? 1 : 8) + 0)

  // 2. 금주 월요일과 어제의 timestamp 출력.
  const [mondayStamp, yesterdayStamp] = [
    nowTimestamp - (nowDay-1) * dayToMs,
    nowTimestamp - dayToMs,
  ];
  
  // 3. 현재시각, 년, 월, 오늘날짜, 어제날짜, 금주 월요일 날짜를 출력.
  const [currentTime, year, month, today, yesterday, monday] = [
    now.getHours(),
    now.getFullYear(),
    `0${now.getMonth() + 1}`.slice(-2),
    `0${now.getDate()}`.slice(-2),
    `0${new Date(yesterdayStamp).getDate()}`.slice(-2),
    `0${new Date(mondayStamp).getDate()}`.slice(-2),
  ];

  let weekStart = `${year}-${month}-${monday}T00:00:00.000Z`;
  let weekEnd = `${year}-${month}-${calcDate}T00:00:00.000Z`;
  let todayStart;
  currentTime < 24 //한국시간 기준으로 한것!! 삼항쓸필요는 없는데 안바꿔놓음
    ? (todayStart = `${year}-${month}-${today}T00:00:00.000Z`)
    : (todayStart = `${year}-${month}-${yesterday}T00:00:00.000Z`);

    // currentTime < 9 //UTC시간이라서 변경한거임!! (삼항연산자사용!!)..... 
    // ? (todayStart = `${year}-${month}-${yesterday}T00:00:00.000Z`)
    // : (todayStart = `${year}-${month}-${today}T00:00:00.000Z`); 

  return { todayStart, weekStart, weekEnd };
}

// 시간변환
function changeTime(time) {
  let seconds = parseInt((time/1000)%60)
      , minutes = parseInt((time/(1000*60))%60)
      , hours = parseInt((time/(1000*60*60))%24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}
module.exports = {timeSet, changeTime}
// // 타이머Start
// router.post('/timestart', authmiddleware, async (req,res, next) => {
//   const email = req.email
//   const { timeset }= req.body;

//   try {
//     if(timeset === 1) {
//     const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
//     const now = new Date();
//     const day = now.getDay();
//     const inTimestamp = now.getTime();
//     const start = await Studytime.create({email,startTime,day,inTimestamp})
//     res.status(200).send({
//       result: true,
//       message: "스터디시작!",
//       start,
//   })
//     return;
//   } 
//   } catch (error) {
//     res.status(400).send({
//       result: false,
//       message: error.message,
//   });
//   }
// });

// // 타이머Out
// router.post('/timeout', authmiddleware, async (req,res, next) => {
//   const email = req.email
//   const { timeset }= req.body;

//   try {
//     if(timeset === 0) {
//     const outTime = moment().format('YYYY-MM-DD HH:mm:ss');
//     const now = new Date();
//     const day = now.getDay();
//     const outTimestamp = now.getTime();
//     const out = await Studytime.create({email,outTime,day,outTimestamp})
//     res.status(200).send({
//       result: true,
//       message: "스터디끝!",
//       out,
//   })
//     return;
//   } 
//   } catch (error) {
//     console.log(error)
//     res.status(400).send({
//       result: false,
//       message: error.message,
//   });
//   }
// });

// // 화상스터디방 저장( room에서 나갈때 저장해주자)

// router.put('/save', authmiddleware, async (req,res,next) => {
//   const email = req.email;
//   const { todayStart, weekStart, weekEnd } = timeSet();
//   console.log(todayStart, weekStart, weekEnd)
//   try{
//     const inTime = await Studytime.find({email}, {inTimestamp:1, email:1})
//     const outTime = await Studytime.find({email}, {outTimestamp:1, email:1})
//     const allinTime = inTime.map( intime => intime.inTimestamp ).filter(intime => intime !== undefined);
//     const arr_allinTime = allinTime[allinTime.length -1]; //맨마지막타임스타드
//     const alloutTime = outTime.map( outtime => outtime.outTimestamp ).filter(outtime => outtime !== undefined);
//     const arr_alloutTime = alloutTime[alloutTime.length -1]; //맨마지막타임아웃
//     const timedif =  arr_alloutTime - arr_allinTime
//     if(arr_alloutTime<arr_allinTime) {
//       res.status(200).send({
//         result: false,
//         message: "타임아웃시간을 눌러주세요"
//       })
//       return;
//     } 
//     const finaltime = changeTime(timedif)

//     await Studytime.updateOne({outTimestamp: arr_alloutTime }, {$set:{studytime: finaltime, timedif: timedif}});
//     await Studytime.updateOne({inTimestamp: arr_allinTime }, {$set:{studytime: finaltime, timedif: timedif}});
//     // todayRecord
//     // TotalstudyTime, +1은 다음날을 기준으로 하기위해서 한것이고 -9시간은 UTC와 KRA 시간이 달라서 조정하기 위해 뺀것!!
//     const today = new Date(todayStart);
//     const tommorownum = today.getTime() + 24*60*60*1000 - 9*60*60*1000; 
//     const todayKST = today.getTime() - 9*60*60*1000;

//     const todaytime_1 = await Studytime.find({ email, inTimestamp:{$gt:todayKST,$lt:tommorownum}})
//     const todaytime_2 = todaytime_1.map(x=> x.timedif).filter(x => x !== undefined);
//     let todaysum = 0;
//     for(let i = 0; i< todaytime_2.length; i++) {
//       todaysum += todaytime_2[i]
//     } console.log(changeTime(todaysum))
    
//     // weakRecord 

//     const weekstart = new Date(weekStart).getTime();
//     const weekend = new Date(weekEnd).getTime();
//     const weekstartKST = weekstart - 9*60*60*1000;
//     const weekendKST = weekend - 9*60*60*1000;
    
//     const weektime_1 = await Studytime.find({ email, inTimestamp:{$gt:weekstartKST,$lt:weekendKST}})
//     const weektime_2 = weektime_1.map(x=> x.timedif).filter(x => x !== undefined);
//     let weeksum = 0;
//     for(let i = 0; i< weektime_2.length; i++) {
//       weeksum += weektime_2[i]
//     } console.log(changeTime(weeksum))
    
//     await Studytime.updateOne({outTimestamp: arr_alloutTime }, {$set:{studytime:changeTime(todaysum), weektime: changeTime(weeksum)}});
//     await Studytime.updateOne({inTimestamp: arr_allinTime }, {$set:{studytime:changeTime(todaysum), weektime: changeTime(weeksum)}});

//     res.status(200).send({
//       result: true,
//       message: "공부시간이 저장되었습니다.",
//       studytime: finaltime,
//       todayrecord : changeTime(todaysum),
//       weekrecord : changeTime(weeksum),
//       email
//   });

//   } catch (error) {
//     console.log(error)
//     res.status(400).send({
//       result: false,
//       message: error.message,
//   });
//   }
// });

// // Study Time,day 조회
// router.get('/', authmiddleware, async (req,res, next) => {
//   const email = req.email;
//   try{
//     const total = await Studytime.find({email})
//     const lasttotal = total[total.length-1];
//     console.log(lasttotal)
//     res.status(200).send({
//       result: true,
//       email : lasttotal.email,
//       day : lasttotal.day,
//       todayrecord : lasttotal.studytime,
//       weekrecord : lasttotal.weektime
//     });
//   } catch (error) {
//     res.status(400).send({
//       result: false,
//       message: error.message,
//   });
//   }
// });


// module.exports = router

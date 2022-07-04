require("dotenv").config()
const Studytime = require("../models/studytime")
const User = require("../models/user")
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

  // 2. 금주 월요일과 어제의 timestamp 출력.
  const [mondayStamp, yesterdayStamp] = [
    nowTimestamp - nowDay * dayToMs,
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
  let todayStart;
  currentTime < 9
    ? (todayStart = `${year}-${month}-${yesterday}T00:00:00.000Z`)
    : (todayStart = `${year}-${month}-${today}T00:00:00.000Z`);

  return { todayStart, weekStart };
}

// 타이머Start
router.post('/timestart', authmiddleware, async (req,res, next) => {
  const { userId } = res.locals.user;
  const { timestart }= req.body;

  try {
    if(timestart === 1) {
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const now = new Date();
    const day = now.getDay();
    const inTimestamp = now.getTime();
    console.log(startTime, day, inTimestamp)
    const start = await Studytime.create({userId,startTime,day,inTimestamp})
    console.log(start)
    res.status(200).send({
      result: true,
      message: "스터디시작!",
      start,
  })
    return;
  } 
  } catch (error) {
    res.status(400).send({
      result: false,
      message: error.message,
  });
  }
});

// 타이머Out
router.post('/timeout', authmiddleware, async (req,res, next) => {
  const { userId } = res.locals.user;
  const { timeout }= req.body;

  try {
    if(timeout === 0) {
    const outTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const now = new Date();
    const day = now.getDay();
    const outTimestamp = now.getTime();
    console.log(outTime)
    const out = await Studytime.create({userId,outTime,day,outTimestamp})
    console.log(out)
    res.status(200).send({
      result: true,
      message: "스터디끝!",
      out,
  })
    return;
  } 
  } catch (error) {
    res.status(400).send({
      result: false,
      message: error.message,
  });
  }
});

// Study Time,day 조회
router.get('/', authmiddleware, async (req,res, next) => {
  const { userId } = res.locals.user;
  const { todayStart, weekStart } = timeSet();
  console.log(todayStart, weekStart)
  try{
    const inTime = await Studytime.find({}, {inTimestamp:1})
    const outTime = await Studytime.find({}, {outTimestamp:1})
    const allinTime = inTime.map( intime => intime.inTimestamp ).filter(intime => intime !== undefined);
    const arr_allinTime = allinTime[allinTime.length -1];
    const alloutTime = outTime.map( outtime => outtime.outTimestamp ).filter(outtime => outtime !== undefined);
    const arr_alloutTime = alloutTime[alloutTime.length -1];

    console.log(arr_allinTime)
    console.log(arr_alloutTime)

    const a = arr_allinTime - arr_alloutTime 
    
    function changeTime(time) {
      let seconds = parseInt((time/1000)%60)
          , minutes = parseInt((time/(1000*60))%60)
          , hours = parseInt((time/(1000*60*60))%24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return hours + ":" + minutes + ":" + seconds;
    }
    
    console.log(changeTime(a))

    const user = await Studytime.find({ userId })
    const day = user.map(x=>x.day)
    console.log(day)
    res.status(200).send({
      result: true,
      studyTime : changeTime(a)

  })
  } catch (error) {
    res.status(400).send({
      result: false,
      message: error.message,
  });
  }
});


module.exports = router

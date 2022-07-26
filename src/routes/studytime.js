require("dotenv").config()

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
    nowTimestamp - (nowDay - 1) * dayToMs,
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
  currentTime < 24
    ? (todayStart = `${year}-${month}-${today}T00:00:00.000Z`)
    : (todayStart = `${year}-${month}-${yesterday}T00:00:00.000Z`);

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
// h(시)변환

function timeConversion(millisec) {
  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
  if (hours < 24) {
    return hours 
  }
}

// 숫자 요일로 바꾸기 

function daySet(day) {
  if(day === 0) {
    return '일'
  } 
  if(day === 1) {
    return '월'
  }
  if(day === 2) {
    return '화'
  }
  if(day === 3) {
    return '수'
  }
  if(day === 4) {
    return '목'
  }
  if(day === 5) {
    return '금'
  }
  if(day === 6) {
    return '토'
  }
}

module.exports = {timeSet, changeTime, timeConversion, daySet}

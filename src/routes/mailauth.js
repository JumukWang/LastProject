require('dotenv').config();
const router = require('express').Router();
const nodemailer = require('nodemailer');    

  router.post('/sendEmail', async function (req, res) {

    let number = Math.floor(Math.random() * 1000000)+100000; 
    if(number>1000000){                                      
       number = number - 100000;                            
    }

    console.log(number);

    // 메일발송 함수

    let transporter = nodemailer.createTransport({
        service: 'gmail'
        , port: 587
        , host: 'smtp.gmail.com'
        , secure: false
        , requireTLS: true
        , auth: {
            user: process.env.NODEMAILER_USER
            , pass: process.env.NODEMAILER_PASS
        }
    });

    let info = await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: req.body.email,         //받아온 이메일 에게
        subject: '인증번호입니다!',
        text: String( number ),        //이 부분은 string값만 보낼수 있다길래
      });                              // 강제로 변경 해줬따


      let checkemail = new Object();
        checkemail.number = number;        // checkemail 객체를 따로 만들고

     return res.send(checkemail);           // 클라이언트에게 보내기


})

    module.exports = router;

require("dotenv").config()
const router = require("express").Router();
const authMiddleware = require("../middlewares/authmiddleware")
const User = require("../models/user")
const Bcrypt = require("bcrypt");
const authmiddleware = require("../middlewares/authmiddleware");
const config = require("../config")

// 마이페이지
router.get('/', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;
    
    try {
        const myPage = await User.findOne({ userId });
        res.status(200).send({ 
            result: true,
            nickName: myPage.nickname,
            userEmail: myPage.email,
            imgUrl: myPage.profile_url,
        });
    } catch (error) {
        res.status(400).send({
            result: false,
            message: error.message,
        });
    }
});

// 마이페이지수정
router.put('/update', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;
    const { nickname, password, passwordCheck } = req.body;
    console.log(user)
    try {
        const myPage = await User.findOne({ userId });
        if (passwordCheck !== password) {
            return res.send({
                result: false,
                message: "비밀번호, 비밀번호 확인이 동일해야 합니다."
            })
        }
        
        const salt = await Bcrypt.genSalt(Number(config.SALT_NUM))
        const hashPassword = await Bcrypt.hash(password, salt)

        const user = await User.updateOne({ userId }, 
            { $set: { nickname, password:hashPassword , passwordCheck }});

            res.send({
                result: true,
                message: "유저정보가 수정되었습니다.",
                user : user,
        })
    } catch (error) {
        res.status(400).send({
            result: false,
            message: error.message,
        });
    }
});

// 마이페이지 이미지수정
router.put('/update/imgUrl', authmiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;
    const { imgUrl } = req.body;

    try {
        const userImg =await User.updateOne({ userId },
            { $set: { imgUrl }});
            res.status(200).send({
                result: true,
                message: "유저이미지가 수정되었습니다.",
                userImg : userImg,
            })
    } catch (error) {
        res.status(400).send({
            result: false,
            message: error.message,
        });
    }
});

module.exports = router

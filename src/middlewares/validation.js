const { validationResult, body } = require('express-validator');

// 검사 미들웨어 분리
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

const validateEmail = [
  body('email').trim().isEmail().withMessage('이메일 형식을 입력해 주세요').normalizeEmail(),
  validate,
];

const validateNick = [
  body('nickname').trim().isLength({ min: 2 }).withMessage('닉네임은 두 글자 이상 입력해 주세요'),
  validate,
];

const validatePwd = [
  body('password')
    .matches(/^[0-9A-Za-z]{4,16}$/)
    .withMessage('비밀번호는 특수문자 제외 4자리 이상에서 16자리 이하로 써주십시오'),
  validate,
];
// 회원가입할때 전체적으로 유효성 검사 & sanitization
const validateAll = [
  body('email').trim().isEmail().withMessage('이메일 형식을 입력해 주세요').normalizeEmail(),
  validate,
  body('password')
    .matches(/^[0-9A-Za-z]{4,16}$/)
    .withMessage('비밀번호는 특수문자 제외 4자리 이상에서 16자리 이하로 써주십시오'),
  validate,
  body('nickname').trim().isLength({ min: 2 }).withMessage('닉네임은 두 글자 이상 입력해 주세요'),
  validate,
];

module.exports = { validateAll, validateEmail, validateNick, validatePwd };

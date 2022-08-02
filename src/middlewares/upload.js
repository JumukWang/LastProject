<<<<<<< HEAD

require("dotenv").config();

=======
require('dotenv').config();
>>>>>>> ff4dda1b924aac139269cd8f0506e09038459be8
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const config = require('../config');

// S3 관련설정
const s3 = new aws.S3({
<<<<<<< HEAD

    accessKeyId : config.S3_ACCESS_KEY,
    secretAccessKey : config.S3_SECRET_ACCESS_KEY,
    region : config.S3_BUCKET_REGION,

=======
  accessKeyId: config.S3_ACCESS_KEY,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  region: config.S3_BUCKET_REGION,
>>>>>>> ff4dda1b924aac139269cd8f0506e09038459be8
});

// 파일 타입설정

const fileFilter = (req, file, cb) => {
<<<<<<< HEAD

    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];

    if (fileType === 'jpg' ||
        fileType === 'png' ||
        fileType === 'jpeg' ||
        fileType === 'gif' ||
        fileType === 'webp'
        ) {
            cb(null, true)
        } else {
            return cb( { message: '지원되는 이미지 파일 형식이 아닙니다.' }, false)
        }
}

// 프로필 이미지 업로드(리사이징 적용)
const profileUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: `${config.S3_BUCKET_NAME}/uploadProfile`,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: 'resized',
                key: function (req, file, cb) {
                    cb(
                        null,
                        Math.floor(Math.random() * 1000).toString() +
                            Date.now() +
                            '.' +
                            file.originalname.split('.').pop()
                    );
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(300, 300).withMetadata());
                },
            },
        ],
    }),
    limits: { fileSize: 1000 * 1000 * 10 },
    fileFilter: fileFilter,

=======
  const typeArray = file.mimetype.split('/');
  const fileType = typeArray[1];

  if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg' || fileType === 'gif' || fileType === 'webp') {
    cb(null, true);
  } else {
    return cb({ message: '지원되는 이미지 파일 형식이 아닙니다.' }, false);
  }
};

// 프로필 이미지 업로드(리사이징 적용)
const profileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${config.S3_BUCKET_NAME}/uploadProfile`,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: true,
    transforms: [
      {
        id: 'resized',
        key: function (req, file, cb) {
          cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(300, 300).withMetadata());
        },
      },
    ],
  }),
  limits: { fileSize: 1000 * 1000 * 10 },
  fileFilter: fileFilter,
>>>>>>> ff4dda1b924aac139269cd8f0506e09038459be8
});

// 방 이미지 업로드(리사이징 적용)
const roomUpload = multer({
<<<<<<< HEAD

    storage: multerS3({
        s3: s3,
        bucket: `${config.S3_BUCKET_NAME}/uploadRoom`,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: 'resized',
                key: function (req, file, cb) {
                    cb(
                        null,
                        Math.floor(Math.random() * 1000).toString() +
                            Date.now() +
                            '.' +
                            file.originalname.split('.').pop()
                    );
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(300, 300).withMetadata());
                },
            },
        ],
    }),
    limits: { fileSize: 1000 * 1000 * 10 },
    fileFilter: fileFilter,

=======
  storage: multerS3({
    s3: s3,
    bucket: `${config.S3_BUCKET_NAME}/uploadRoom`,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: true,
    transforms: [
      {
        id: 'resized',
        key: function (req, file, cb) {
          cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(300, 300).withMetadata());
        },
      },
    ],
  }),
  limits: { fileSize: 1000 * 1000 * 10 },
  fileFilter: fileFilter,
>>>>>>> ff4dda1b924aac139269cd8f0506e09038459be8
});

// 프로필 이미지 삭제

const profileDelete = (profile_url) => {
<<<<<<< HEAD

    const filename = profile_url.split('/')[4];

    s3.deleteObject(
        {
            Bucket: `${config.S3_BUCKET_NAME}/uploadProfile`,
            Key: filename,
        },
        function (err, data) {}
    );

=======
  const filename = profile_url.split('/')[4];

  s3.deleteObject(
    {
      Bucket: `${config.S3_BUCKET_NAME}/uploadProfile`,
      Key: filename,
    },
    function (err, data) {},
  );
>>>>>>> ff4dda1b924aac139269cd8f0506e09038459be8
};

exports.profileUpload = multer(profileUpload);
exports.roomUpload = multer(roomUpload);
exports.profileDelete = profileDelete;
<<<<<<< HEAD


// module.exports = { profileUpload, }
=======
>>>>>>> ff4dda1b924aac139269cd8f0506e09038459be8

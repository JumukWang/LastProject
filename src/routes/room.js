const router = require('express').Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { roomUpload } = require('../middlewares/upload');
const roomController = require('../controller/room');

// 방생성
router.post('/create/:userId', authMiddleware, roomUpload.single('imgUrl'), roomController.roomCreate);

// 공개방 입장
router.post('/public-room/:roomId/:userId', authMiddleware, roomController.publicRoom);

// 비밀방 입장
router.post('/private-room/:roomId/:userId', authMiddleware, roomController.privateRoom);

// 방나가기
router.post('/exit/:roomId/:userId', authMiddleware, roomController.roomExit);

// 방삭제
router.delete('/:roomId/:userId', authMiddleware, roomController.deleteRoom);

// 스터디룸 검색
router.get('/search/:word', roomController.searchRoom);

//찜한 스터디 조회
router.get('/like-room/:userId', authMiddleware, roomController.userLikeRoom);

//참여중인 스터디 조회
router.get('/entered-room/:userId', authMiddleware, roomController.enteredRoom);

//호스트중인 스터디 조회
router.get('/host-room/:userId', authMiddleware, roomController.hostRoom);

//방 정보창
router.get('/info/:roomId', roomController.roomInfo);

//방 탈퇴
//host가 방탈퇴 시 방삭제
router.post('/outroom/:roomId/:userId', authMiddleware, roomController.outRoom);

module.exports = router;

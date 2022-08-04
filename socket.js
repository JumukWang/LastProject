const app = require('./app');
const config = require('./src/config');
const server = require('http').createServer(app);
const Redis = require('ioredis');
const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  legacyMode: true,
});

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://egloo.link'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  adapter: require('socket.io-redis')({
    pubClient: redisClient,
    subClient: redisClient.duplicate(),
  }),
});

const users = {};

const socketToRoom = {};
const socketToNickname = {};
const socketToUser = {};
const socketToProfileImg = {};

io.on('connection', (socket) => {
  let roomId;
  socket.on('join room', (payload) => {
    console.log(payload);
    roomId = payload.roomId;
    if (users[roomId]) {
      users[roomId].push(socket.id);
    } else {
      users[roomId] = [socket.id];
    }
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId} nick:${payload.nickname}`);

    socketToRoom[socket.id] = roomId;
    socketToNickname[socket.id] = payload.nickname;
    socketToProfileImg[socket.id] = payload.profileImg;

    socketToUser[socket.id] = {
      test: 'test',
      nickname: payload.nickname,
      profileImg: payload.profileImg,
    };
    const others = users[roomId].filter((id) => id !== socket.id);

    const usersInThisRoom = others.map((socketId) => {
      return {
        socketId,
        nickname: socketToNickname[socketId],
        profileImg: socketToProfileImg[socketId],
      };
    });

    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    const callerNickname = socketToNickname[payload.callerID];
    const callerProfileImg = socketToProfileImg[payload.callerID];
    const userInfo = socketToUser[socket.id];
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
      callerNickname,
      callerProfileImg,
      userInfo,
    });
  });

  socket.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });
  socket.on('send_message', (payload) => {
    socket.to(payload.roomId).emit('receive_message', payload);
    console.log(payload);
  });

  socket.on('disconnecting', () => {
    if (users[roomId]) {
      users[roomId] = users[roomId].filter((id) => id !== socket.id);

      const userInfo = socketToUser[socket.id];

      socket.broadcast.to(roomId).emit('user left', {
        socketId: socket.id,
        userInfo,
      });

      socket.leave(roomId);

      delete socketToNickname[socket.id];
      delete socketToUser[socket.id];
      delete socketToRoom[socket.id];
    }
  });
});

module.exports = { server };

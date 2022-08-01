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
const { RedisMessageStore } = require('./src/server/messageStore');
const messageStore = new RedisMessageStore(redisClient);

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000'],
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

io.on('connection', (socket) => {
  let roomId;
  socket.on('join room', async (payload) => {
    await redisClient.sadd('room_' + roomId, payload.nickname);
    const [messages] = await Promise.all([messageStore.findMessagesForUser(payload.nickname)]);
    const messagePerUser = new Map();
    messages.forEach((payload) => {
      const { from, to } = payload;
      const otherUser = payload === from ? to : from;
      if (messagePerUser.has(otherUser).push(payload)) {
        messagePerUser.get(otherUser).push(payload);
      } else {
        messagePerUser.set(otherUser, [payload]);
      }
    });
    roomId = payload.roomId;
    if (users[roomId]) {
      users[roomId].push(socket.id);
    } else {
      users[roomId] = [socket.id];
    }
    socket.join(roomId);
    socket.to(roomId).emit('welcome', { author: payload.nickname });
    console.log(`User with ID: ${socket.id} joined room: ${roomId} nick:${payload.nickname}`);

    socketToRoom[socket.id] = roomId;
    socketToNickname[socket.id] = payload.nickname;

    socketToUser[socket.id] = {
      test: 'test',
      nickname: payload.nickname,
      //   profileImg: payload.profileImg,
    };
    const others = users[roomId].filter((id) => id !== socket.id);

    const usersInThisRoom = others.map((socketId) => {
      return {
        socketId,
        nickname: socketToNickname[socketId],
      };
    });
    await redisClient.smembers('room_' + others);
    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    const callerNickname = socketToNickname[payload.callerID];
    const userInfo = socketToUser[socket.id];
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
      callerNickname,
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
    messageStore.saveMessage(payload);
    console.log(payload);
  });

  socket.on('exit room', () => {
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

  socket.on('disconnect', () => {
    if (users[roomId]) {
      users[roomId] = users[roomId].filter((id) => id !== socket.id);

      const userInfo = socketToUser[socket.id];
      redisClient.del(userInfo);
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

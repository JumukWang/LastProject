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
// const { RedisMessageStore } = require('./src/server/messageStore');
// const messageStore = new RedisMessageStore(redisClient);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
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
  socket.on('join room', (payload) => {
    console.log(payload.roomId);
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

// const users = {};
// const socketToRoom = {};

// io.on('connection', async (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on('join room', async (roomId, nick) => {
//     await redisClient.sadd('room_' + roomId, nick);
//     const [messages] = await Promise.all([messageStore.findMessagesForUser(nick)]);
//     const messagePerUser = new Map();
//     messages.forEach((data) => {
//       const { from, to } = data;
//       const otherUser = nick === from ? to : from;
//       if (messagePerUser.has(otherUser)) {
//         messagePerUser.get(otherUser).push(data);
//       } else {
//         messagePerUser.set(otherUser, [data]);
//       }
//     });
//     socketToRoom[socket.id] = roomId;
//     socket.broadcast.to(roomId).emit(); // 이벤트명으로 emit 이벤트 명과 메세지를 출력
//     const smembers = await redisClient.smembers('room_' + roomId);
//     const filteredlist = smembers.filter((userId) => userId !== nick);

//     socket.emit('all users', filteredlist);
//   });

//   socket.on('sending signal', (payload) => {
//     io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerId: payload.callerId });
//   });

//   socket.on('returning signal', (payload) => {
//     io.to(payload.callerId).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
//   });

//   socket.on('send_message', (data) => {
//     socket.to(data.roomId).emit('receive_message', data);
//     messageStore.saveMessage(data);
//     console.log(data.roomId);
//   });

//   socket.on('disconnect', () => {
//     const roomId = socketToRoom[socket.id];
//     let room = users[roomId];
//     if (room) {
//       room = room.filter((id) => id !== socket.id);
//       users[roomId] = room;
//     }
//   });
// });
module.exports = { server };

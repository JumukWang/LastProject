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
    origin: ['http://localhost:3000', 'https://egloo.link'],
    credentials: true,
  },
  adapter: require('socket.io-redis')({
    pubClient: redisClient,
    subClient: redisClient.duplicate(),
  }),
});

const users = {};
const socketToRoom = {};

io.on('connection', async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join room', async (roomId, nick) => {
    const [messages] = await Promise.all([messageStore.findMessagesForUser(nick)]);
    const messagePerUser = new Map();
    messages.forEeach((data) => {
      const { from, to } = data;
      const otherUser = nick === from ? to : from;
      if (messagePerUser.has(otherUser)) {
        messagePerUser.get(otherUser).push(data);
      } else {
        messagePerUser.set(otherUser, [data]);
      }
    });
    socketToRoom[socket.id] = roomId;
    const usersInThisRoom = users[roomId].filter((id) => id !== socket.id);
    socket.broadcast.to(usersInThisRoom).emit(); // 이벤트명으로 emit 이벤트 명과 메세지를 출력
    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerId: payload.callerId });
  });

  socket.on('returning signal', (payload) => {
    io.to(payload.callerId).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('send_message', (nick, data, to) => {
    const message = {
      data,
      from: nick,
      to,
    };
    socket.to(data.room).emit('receive_message', message);
    messageStore.saveMessage(message);
    console.log(data);
  });

  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    let room = users[roomId];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomId] = room;
    }
  });
});

module.exports = { server };

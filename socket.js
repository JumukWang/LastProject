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
const { getsessionStorage } = require('./src/server/sessionStore');
// db 들어갈 자리

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

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

const users = {};

const socketToRoom = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join room', (userId, roomId) => {
    const getUser = getsessionStorage();
    const userMap = getUser.findSession(userId); // object 형태로 들어온다.
    if (users[roomId]) {
      const length = users[roomId].length;
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      users[roomId].push(socket.id);
    } else {
      users[roomId] = [socket.id];
      console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    }
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

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
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

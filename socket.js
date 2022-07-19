const app = require('./app');
const config = require('./src/config');
const server = require('http').createServer(app);
const Redis = require('ioredis');
const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
});
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

const { RedisSessionStore } = require('./src/server/sessionStore');
const sessionStore = new RedisSessionStore(redisClient);

const { RedisMessageStore } = require('./src/server/messageStore');
const messageStore = new RedisMessageStore(redisClient);

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
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

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (nick, room) => {
    socket.join(room);
    socket.to(room).emit('welcome', { author: nick });
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });
  socket.on('offer', (offer, room) => {
    console.log(room);
    socket.to(room).emit('offer', offer);
  });
  socket.on('answer', (answer, room) => {
    socket.to(room).emit('answer', answer);
  });
  socket.on('ice', (ice, room) => {
    socket.to(room).emit('ice', ice);
  });
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
    console.log(data);
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => socket.to(room).emit('bye'));
  });
});

module.exports = { server };

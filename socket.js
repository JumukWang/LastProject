const app = require('./app');
const redis = require('redis');
const config = require('./src/config');
const server = require('http').createServer(app);
const { createAdapter } = require('@socket.io/redis-adapter');
const { Room, User } = require('./src/models');
// db 들어갈 자리

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const pubClient = redis.createClient({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
});
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
  socket.on('join_room', async (nickname, roomTitle) => {
    try {
      socket.join(roomTitle);
      socket.to(roomTitle).emit('welcome', { nickname });
      console.log(`User with ID: ${nickname} joined room: ${roomTitle}`);
      socket.emit('welcome_msg', nickname); //roomID

      socket.on('send_message', (message) => {
        console.log('메시지: ', message);
        socket.to(roomTitle).emit('receive_message', message);
        console.log(message);
      });
      socket.on('disconnecting', () => {
        socket.rooms.forEach((roomTitle) => socket.to(roomTitle).emit('bye'));
        console.log(roomTitle);
      });

      socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
      });
    } catch (error) {
      console.error(error);
    }
  });
});

module.exports = { server };

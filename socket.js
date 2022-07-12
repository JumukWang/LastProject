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

// const pubClient = redis.createClient({
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
//   password: config.REDIS_PASSWORD,
// });
// const subClient = pubClient.duplicate();
// io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
  socket.on('join', async (nickname, title) => {
    try {
      socket.join(title);
      socket.to(title).emit('welcome', { nickname });

      socket.emit('welcome_msg', nickname); //roomID

      socket.on('send_message', (message) => {
        socket.to(title).emit('receive_message', message);
      });
      socket.on('disconnecting', () => {
        socket.rooms.forEach((title) => socket.to(title).emit('bye'));
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

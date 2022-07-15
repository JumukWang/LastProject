const app = require('./app');
const redis = require('redis');
const config = require('./src/config');
const server = require('http').createServer(app);
const { createAdapter } = require('@socket.io/redis-adapter');
const { Room, User } = require('./src/models');
// db 들어갈 자리

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://egloo.link'],
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

// io.on('connection', (socket) => {
//   socket.on('join', async (nickname, title) => {
//     try {
//       socket.join(title);
//       socket.to(title).emit('welcome', { nickname });

//       socket.emit('welcome_msg', nickname); //roomID

//       socket.on('send_message', (message) => {
//         socket.to(title).emit('receive_message', message);
//       });
//       socket.on('disconnecting', () => {
//         socket.rooms.forEach((title) => socket.to(title).emit('bye'));
//       });

//       socket.on('disconnect', () => {
//         console.log('User Disconnected', socket.id);
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   });
// });
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

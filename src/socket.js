const app = require('./app');
const socket = require('http').Server(app);
const io = require('socket.io')(socket);
const port = process.env.PORT || 3000;



io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

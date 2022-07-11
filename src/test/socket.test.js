// describe('Last project', () => {
//   let io, serverSocket, clientSocket;
//   // 실행 전 딱 한번만 실행되는 명령어
//   beforeAll((done) => {
//     const server = require('http').createServer(app);
//     const io = require('socket.io')(server, {
//       cors: {
//         origin: '*',
//         credentials: true,
//       },
//     });
//   });
//   // 실행 후 딱 한번만 실행되는 명령어
//   afterAll(() => {});

//   // 실제 실행 함수
//   test('should work', (done) => {
//     io.on('connection', (socket) => {
//       expect(arg).toBe('world');
//       done();
//     });
//     serverSocket.emit('hello', 'world');
//   });

//   test('should work (with ack)', (done) => {
//     serverSocket.on('hi', (cb) => {
//       cb('hola');
//     });
//     clientSocket.emit('hi', (arg) => {
//       expect(arg).toBe('hola');
//       done();
//     });
//   });
// });

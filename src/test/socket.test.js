
describe("Last project", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const server = require("http").createServer(app)
    const io = require("socket.io")(server, {
        cors: {
          origin: "*",
          credentials: true,
        },
      })
  });

  afterAll(() => {
    
  });

  test("should work", (done) => {
    io.on("connection", (socket) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });
});
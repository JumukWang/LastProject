const app = require("./app")
const io = require("socket.io")(socket)
const { Op } = sequelize

const socket = require("http").Server(app)
// db 들어갈 자리

const socketIo = require("socket.io")(socket, {
  cors: {
    origin: "*",
    credentials: true,
  },
})

/** 
 * peerId
 * userId
 * roomId
 * nickname
 */

io.on("connection", (socket) => {
  // 변수 들어갈 자리

  socket.on("", (msg) => {
    io.emit("", msg)
  })
})

const app = require("../app")
const sequelize = require("sequelize");
const { Op } = sequelize

const socket = require("http").Server(app)
// db 들어갈 자리

const io = require("socket.io")(socket, {
  cors: {
    origin: "*",
    credentials: true,
  },
})

/**
 * nickname
 * myStreamId
 * userId
 * roomId
 * title
 */

io.on("connection", (socket) => {
  console.log("connect")
  // 채팅방 입장
  socket.on("join_room", async (nickname, roomId) => {
    try {
      socket.join(roomId)
      socket.to(roomId).emit("connect", nickname)

      socket.on("message", (message) => {
        socket.to(roomId).emit("message", nickname, message)
      })
    } catch (error) {
      console.log("채팅방에 입장하지 못했습니다.")
      console.error(error)
    }
  })
})

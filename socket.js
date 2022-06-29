const app = require("./app")
const sequelize = require("sequelize")
const { Room, User } = require("./models")
const { Op } = sequelize

const server = require("http").createServer(app)
// db 들어갈 자리

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
})

/**
 * 
 * nickname
 * myStreamId
 * userId
 * roomId
 * title
 */

io.on("connection", (socket) => {
  let nickname
  let roomTitle
  let roomID
  socket.on("join_room", async (nickname, roomTitle, roomId) => {
    nickname = nickname
    roomTitle = title
    try {
      socket.join(roomID)
      socket.emit("connect", nickname)
      

      console.log(`User with ID: ${nickname} joined room: ${roomID}`)
      socket.emit("welcome_msg", nickname, roomID)

      socket.on("send_message", (message) => {
        console.log("메시지: ", message)
        socket.to(roomID).emit("receive_message", message)
      })

      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
      })
    } catch (error) {
      console.error(error)
    }
  })
})

// io.on("connection", (socket) => {
//   console.log("connect")
//   // 채팅방 입장
//   socket.on("join_room", async (nickname, roomId) => {
//     try {
//       socket.join(roomId)
//       socket.to(roomId).emit("connect", nickname)

//       socket.on("message", (message) => {
//         socket.to(roomId).emit("message", nickname, message)
//       })
//     } catch (error) {
//       console.log("채팅방에 입장하지 못했습니다.")
//       console.error(error)
//     }
//   })
// })

module.exports = { server }

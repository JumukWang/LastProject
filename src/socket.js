const app = require("./app")
const {studyroom, User} = require("./models")
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
  socket.on("join_room", async (nickname, roomTitle, roomId) => {
    let nickName = User.nickname
    let title = roomTitle
    let roomID = roomId
    try {
      socket.join(roomID)
      socket.emit("connect", nickName)
      

      console.log(`User with ID: ${nickName} joined room: ${roomID}`)
      socket.emit("welcome_msg", nickName, roomID)

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

module.exports = { server }

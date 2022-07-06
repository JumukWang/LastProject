const app = require("./app")
const { studyroom, User } = require("./src/models")
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
  socket.on("join_room", async (nickname, roomTitle) => {
    //roomId
    // let roomID = roomId
    try {
      socket.join(roomTitle)
      socket.to(roomTitle).emit("welcome", { author: nickname })
      console.log(`User with ID: ${nickname} joined room: ${roomTitle}`)
      socket.emit("welcome_msg", nickname) //roomID

      socket.on("send_message", (message) => {
        console.log("메시지: ", message)
        socket.to(roomTitle).emit("receive_message", message)
        console.log(message)
      })
      socket.on("disconnecting", () => {
        socket.rooms.forEach((roomTitle) => socket.to(roomTitle).emit("bye"))
        console.log(roomTitle)
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
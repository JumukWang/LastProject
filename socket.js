const app = require("./app")
const redis = require("socket.io-redis")
const { studyroom, User } = require("./src/models")
const server = require("http").createServer(app)
// db 들어갈 자리

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
})
// io.adapter(redis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD
// }))


io.on("connection", (socket) => {
  socket.on("join_room", async (nickname, roomTitle) => {
    try {
      socket.join(roomTitle)
      socket.to(roomTitle).emit("welcome", { nickname })
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
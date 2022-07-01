const { server } = require("./socket")
const port = process.env.PORT;

// const { server, https } = require("./socket");
// const port = process.env.PORT

// https.listen(443, () => {
//   console.log("https server on 443");
// })

server.listen(port, () => {
  console.log(`${port}"번 포트로 서버가 열렸습니다."`)
})

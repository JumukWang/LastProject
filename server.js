const { server } = require("./socket")
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`${port}"번 포트로 서버가 열렸습니다."`)
})
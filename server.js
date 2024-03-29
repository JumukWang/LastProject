const { server } = require('./socket');
const config = require('./src/config');
const logger = require('./src/config/winston');
const port = config.PORT;

server.listen(port, () => {
  logger.info(`${port}"번 포트 접속"`);
  console.log(`${port}"번 포트로 서버가 열렸습니다."`);
});

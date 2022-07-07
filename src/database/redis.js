//redis.js
const redis = require("redis")
let redisClient
module.exports = function initRedisClient() {
  redisClient = new MyRedisClient()
}
module.exports = function getRedisClient() {
  if (redisClient) {
    initRedisClient()
  }
  return redisClient
}
class MyRedisClient {
  constructor() {
    this.setRedis()
  }

  //connection close 추가
  quit(callback) {
    this.client.quit(callback)
  }

  setRedis() {
    this.setRedisClient()

    this.client.on("connect", this._connectHandler)
    //connection error
    this.client.on("error", this._errorHandler)
    //connection close
    this.client.on("end", this._endHandler)
  }
  errorHandler(err) {
    console.error("Redis connection Error!! >>", err)
  }
  endHandler() {
    console.error("Redis connection close!!")
  }
  connectHandler() {
    console.log("Redis connection!")
  }
  setRedisClient() {
    this.client = redis.createClient(
      `redis://${process.ENV.user}:${process.ENV.password}@${process.ENV.host}:${process.ENV.port}`
    )
  }
  //set 명령 실행 추가
  setex(key, value, expireSec, callback) {
    this.client.set(key, expireSec, value, callback)
  }

  //get 명령 실행 추가
  get(key, callback) {
    this.client.get(key, callback)
  }
}

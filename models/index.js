const Sequelize = require("sequelize")
const env = process.env.NODE_ENV || "development"
const config = require("../config/config")[env]
const User = require("./user")
const studyTime = require("./studytime")
const studyRoom = require("./studyroom")
const db = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

db.sequelize = sequelize
db.User = User
db.studyTime = studyTime
db.studyRoom = studyRoom

User.init(sequelize)
studyTime.init(sequelize)
studyRoom.init(sequelize)

module.exports = db
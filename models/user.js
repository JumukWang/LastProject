const Sequelize = require("sequelize")

// User model
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
        },
        nickname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        profileImg: {
          type: Sequelize.STRING,
        },
        refreshToken: {
          type: Sequelize.STRING,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Users",
        tableName: "User",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    )
  }
  static associate(db) {
    db.User.hasMany()
  }
}

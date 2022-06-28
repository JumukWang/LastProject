const Sequelize = require("sequelize")

// User model
module.exports = class Todo extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        text: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "todo",
        tableName: "todos",
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

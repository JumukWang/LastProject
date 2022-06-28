const Sequelize = require("sequelize")

// User model
module.exports = class studyroom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        roomId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        date: {
          type: Sequelize.STRING,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "studyroom",
        tableName: "studyrooms",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    )
  }
  static associate(db) {
    db.studyroom.hasMany(db.User,{
      
    })
  }
}

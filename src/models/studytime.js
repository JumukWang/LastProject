const Sequelize = require("sequelize");

// User model
module.exports = class studyTime extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        studyTime: {
          type: Sequelize.INTEGER,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "studytime",
        tableName: "studytimes",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.studyTime.hasMany()
  }
};
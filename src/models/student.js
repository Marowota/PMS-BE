"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.User, { foreignKey: "userID" });
      Student.belongsTo(models.ClassInfo, { foreignKey: "classID" });
      Student.hasMany(models.Implementation);
    }
  }
  Student.init(
    {
      studentCode: DataTypes.STRING,
      major: DataTypes.STRING,
      status: DataTypes.STRING,
      userID: DataTypes.INTEGER,
      classID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};

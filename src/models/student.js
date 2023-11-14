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
      Student.hasMany(models.Implementation);
    }
  }
  Student.init(
    {
      studentCode: DataTypes.STRING,
      class: DataTypes.STRING,
      major: DataTypes.STRING,
      status: DataTypes.STRING,
      userID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};

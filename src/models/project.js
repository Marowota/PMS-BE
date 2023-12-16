"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.Teacher, { foreignKey: "teacherID" });
      Project.hasOne(models.Implementation);
      Project.belongsTo(models.ClassInfo, { foreignKey: "classID" });
      Project.belongsTo(models.RegisterTime, { foreignKey: "registerTimeID" });
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      teacherID: DataTypes.INTEGER,
      requirement: DataTypes.TEXT,
      maxStudentNumber: DataTypes.INTEGER,
      type: DataTypes.STRING,
      faculty: DataTypes.STRING,

      major: DataTypes.STRING,
      classID: DataTypes.INTEGER,

      isPublic: DataTypes.BOOLEAN,
      isRegistered: DataTypes.BOOLEAN,
      registerTimeID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClassInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassInfo.hasMany(models.Project, {
        foreignKey: { name: "classID", allowNull: true },
      });
      ClassInfo.hasMany(models.Student, {
        foreignKey: { name: "classID", allowNull: true },
      });
    }
  }
  ClassInfo.init(
    {
      className: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ClassInfo",
    }
  );
  return ClassInfo;
};

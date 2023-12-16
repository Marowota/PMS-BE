"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegisterTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RegisterTime.hasMany(models.Project);
    }
  }
  RegisterTime.init(
    {
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      faculty: DataTypes.STRING,
      year: DataTypes.STRING,
      semester: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RegisterTime",
    }
  );
  return RegisterTime;
};

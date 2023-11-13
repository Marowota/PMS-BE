"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Implementation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Implementation.init(
    {
      studentID: DataTypes.INTEGER,
      projectID: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Implementation",
    }
  );
  return Implementation;
};

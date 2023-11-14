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
      Implementation.belongsTo(models.Student, { foreignKey: "studentID" });
      Implementation.belongsTo(models.Project, { foreignKey: "projectID" });
    }
  }
  Implementation.init(
    {
      studentID: DataTypes.INTEGER,
      projectID: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      isCompleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Implementation",
    }
  );
  return Implementation;
};

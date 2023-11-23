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
      Implementation.belongsTo(models.Student, {
        as: "Student1",
        foreignKey: "student1ID",
      });
      Implementation.belongsTo(models.Student, {
        as: "Student2",
        foreignKey: "student2ID",
      });
      Implementation.belongsTo(models.Project, { foreignKey: "projectID" });
    }
  }
  Implementation.init(
    {
      student1ID: DataTypes.INTEGER,
      student2ID: DataTypes.INTEGER,
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

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Report.belongsTo(models.AcademicAffair, { foreignKey: "authorId" });
    }
  }
  Report.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      dateCreated: DataTypes.DATE,
      dateUpdated: DataTypes.DATE,
      authorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Report",
    }
  );
  return Report;
};

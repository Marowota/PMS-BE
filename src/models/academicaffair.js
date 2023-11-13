"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AcademicAffair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AcademicAffair.belongsTo(models.User, { foreignKey: "userID" });
      AcademicAffair.hasMany(models.Report);
    }
  }
  AcademicAffair.init(
    {
      academicAffairCode: DataTypes.STRING,
      faculty: DataTypes.STRING,
      position: DataTypes.STRING,
      userID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AcademicAffair",
    }
  );
  return AcademicAffair;
};

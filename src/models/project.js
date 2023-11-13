'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    name: DataTypes.STRING,
    teacherID: DataTypes.INTEGER,
    requirement: DataTypes.STRING,
    maxStudentNumber: DataTypes.INTEGER,
    type: DataTypes.STRING,
    faculty: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    isRegistered: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};
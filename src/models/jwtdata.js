'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JWTData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JWTData.init({
    refreshToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JWTData',
  });
  return JWTData;
};
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Implementation", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student1ID: {
        type: Sequelize.INTEGER,
      },
      student2ID: {
        type: Sequelize.INTEGER,
      },
      projectID: {
        type: Sequelize.INTEGER,
      },
      score: {
        type: Sequelize.FLOAT,
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
      },
      submissionLink: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Implementation");
  },
};

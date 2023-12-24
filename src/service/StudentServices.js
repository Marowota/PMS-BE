import db from "../models";
import ProjectServices from "./ProjectService";
import { Op } from "sequelize";

const getProjectOfStudent = async (id) => {
  if (typeof id !== "number" || id < 1) {
    return {
      EM: "Student id is invalid",
      EC: 25,
      DT: "",
    };
  } else {
    try {
      let findStudentId = await db.Student.findOne({
        where: {
          userId: id,
        },
        attributes: ["id"],
        raw: true,
        nest: true,
      });

      if (findStudentId === null) {
        return {
          EM: "Student not found",
          EC: 26,
          DT: "",
        };
      }

      let studentId = findStudentId.id;

      let existingStudent = await db.Implementation.findOne({
        where: {
          [Op.or]: [{ student1ID: studentId }, { student2ID: studentId }],
        },
        attributes: ["student1ID", "student2ID", "projectID"],
        raw: true,
        nest: true,
      });
      if (!existingStudent) {
        return {
          EM: "You have not registered any project yet!",
          EC: 27,
          DT: "",
        };
      }
      const projectData = await ProjectServices.getProjectById(
        existingStudent.projectID
      );
      const projectScore = await db.Implementation.findOne({
        where: {
          projectID: existingStudent.projectID,
        },
        attributes: ["score"],
      });
      const returnData = {
        ...projectData.DT,
        score: projectScore.score,
      };
      return {
        EM: "Get project of student successfully",
        EC: 0,
        DT: returnData,
      };
    } catch (error) {
      return {
        EM: "There is something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};
module.exports = { getProjectOfStudent };

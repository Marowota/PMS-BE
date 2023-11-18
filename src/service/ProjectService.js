import db from "../models/index";
import { Op } from "sequelize";

const getProjectList = async () => {
  try {
    let projectList = await db.Project.findAll({
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty", "academicDegree"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email", "phone"],
        },
      },
      attributes: ["id", "name", "type", "faculty"],
      raw: true,
      nest: true,
    });
    return {
      EM: "Success",
      EC: 0,
      DT: projectList,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getProjectWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Project.findAndCountAll({
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty", "academicDegree"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email", "phone"],
        },
      },
      attributes: ["id", "name", "type", "faculty"],
      raw: true,
      nest: true,
      offset: offset,
      limit: limit,
    });

    let totalPage = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPage,
      projects: rows,
    };

    return {
      EM: "Get data successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const isProjectValid = async (projectName) => {
  let projectCheck = await db.Project.findOne({
    where: {
      name: projectName,
    },
  });
  if (!projectCheck) return false;
  return true;
};

const createProject = async (rawData) => {
  try {
    if (await isProjectValid(rawData.projectName)) {
      return {
        EM: "Project is already exist",
        EC: -1,
        DT: "",
      };
    }

    await db.Project.create({
      name: rawData.projectName,
      teacherID: rawData.teacherId,
      requirement: rawData.projectRequirement,
      maxStudentNumber: 2,
      type: rawData.projectType,
      faculty: rawData.projectFaculty,
      isPublic: true,
      isRegistered: false,
    });

    return {
      EM: "Create new project successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const deleteProject = async (projectIds) => {
  try {
    console.log(">>> check projectIds", projectIds);
    await db.Project.destroy({
      where: {
        id: {
          [Op.in]: projectIds,
        },
      },
    });
    return {
      EM: "Delete project successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

module.exports = {
  getProjectList,
  createProject,
  getProjectWithPagination,
  deleteProject,
};

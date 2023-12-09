import db from "../models/index";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";
// import { removeTicks } from "sequelize/types/utils";

const getProjectById = async (projectId) => {
  if (typeof projectId !== "number" || projectId < 1) {
    return {
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    };
  } else {
    try {
      let project = await db.Project.findOne({
        where: { id: projectId },
        include: {
          model: db.Teacher,
          required: true,
          attributes: ["id", "faculty", "academicDegree"],
          include: {
            model: db.User,
            required: true,
            attributes: ["id", "name", "email", "phone"],
          },
        },
        attributes: [
          "id",
          "name",
          "type",
          "faculty",
          "requirement",
          "isregistered",
        ],
        raw: true,
        nest: true,
      });
      if (!project)
        return {
          EM: "Project not found",
          EC: 16,
          DT: "",
        };
      else
        return {
          EM: "Get project by id successfully",
          EC: 0,
          DT: project,
        };
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const getProjectList = async () => {
  try {
    let projectList = await db.Project.findAll({
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["id", "faculty", "academicDegree"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email", "phone"],
        },
      },
      attributes: [
        "id",
        "name",
        "type",
        "faculty",
        "requirement",
        "isregistered",
      ],
      raw: true,
      nest: true,
    });
    return {
      EM: "Get project list successfully",
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

const getProjectWithPagination = async (page, limit, search = "") => {
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
      where: {
        [db.Sequelize.col("Project.name")]: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("Project.name")),
          "LIKE",
          "%" + search + "%"
        ),
      },
      attributes: [
        "id",
        "name",
        "type",
        "faculty",
        "requirement",
        "isregistered",
      ],
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
      EM: "Get project with pagination successfully",
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
  if (
    typeof rawData.projectName !== "string" ||
    rawData.projectName === "" ||
    typeof rawData.teacherId !== "number" ||
    typeof rawData.projectRequirement !== "string" ||
    (rawData.projectType !== "1" && rawData.projectType !== "2") ||
    typeof rawData.projectFaculty !== "string" ||
    rawData.projectFaculty === ""
  ) {
    return {
      EM: "Project information is invalid",
      EC: 13,
      DT: "",
    };
  } else {
    try {
      if (await isProjectValid(rawData.projectName)) {
        return {
          EM: "Project is already exist",
          EC: 12,
          DT: "",
        };
      } else {
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
          EM: "Create project successfully",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const deleteProject = async (projectIds) => {
  const checkArr = (projectArr) => {
    let check = 0;
    projectArr.forEach((id) => {
      if (typeof id !== "number") check += 1;
    });
    return check;
  };
  if (!Array.isArray(projectIds)) {
    return {
      EM: "Project id list is invalid",
      EC: 14,
      DT: "",
    };
  } else if (checkArr(projectIds)) {
    return {
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    };
  } else {
    try {
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
  }
};

const updateProject = async (project, projectId) => {
  if (projectId < 1 || typeof projectId !== "number")
    return {
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    };
  else if (
    typeof project.projectName !== "string" ||
    project.projectName === "" ||
    typeof project.teacherId !== "number" ||
    typeof project.projectRequirement !== "string" ||
    (project.projectType !== "1" && project.projectType !== "2") ||
    typeof project.projectFaculty !== "string" ||
    project.projectFaculty === ""
  )
    return {
      EM: "Project information is invalid",
      EC: 13,
      DT: "",
    };
  else {
    try {
      const data = await db.Project.findOne({
        where: { id: projectId },
      });
      if (data) {
        await data.update({
          name: project.projectName,
          requirement: project.projectRequirement,
          type: project.projectType,
          faculty: project.projectFaculty,
          teacherID: project.teacherId,
        });
        return {
          EM: "Update project successfully",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Project not found",
          EC: 16,
          DT: "",
        };
      }
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

module.exports = {
  getProjectList,
  createProject,
  getProjectWithPagination,
  isProjectValid,
  deleteProject,
  updateProject,
  getProjectById,
};

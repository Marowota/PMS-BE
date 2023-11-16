import db from "../models/index";

const getProjectList = async () => {
  try {
    let projectList = await db.Project.findAll({
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
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

const isProjectValid = async (projectName) => {
  let projectCheck = await db.Project.findOne({
    where: {
      name: projectName,
    },
  });
  if (!projectCheck) return false;
  return true;
};

const createProject = async (projectData) => {
  try {
    if (await isProjectValid(projectData.name)) {
      return {
        EM: "Project is already exist",
        EC: -1,
        DT: "",
      };
    }

    await db.Project.create({
      name: projectData.name,
      teacherID: projectData.teacherID,
      requirement: projectData.requirement,
      maxStudentNumber: 2,
      type: projectData.type,
      faculty: projectData.faculty,
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

module.exports = {
  getProjectList,
  createProject,
};

import db from "../models/index";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";

const getProjectById = async (projectId) => {
  try {
    let project = await db.Project.findOne({
      where: { id: projectId },
      include: [
        {
          model: db.Teacher,
          required: true,
          attributes: ["id", "faculty", "academicDegree"],
          include: {
            model: db.User,
            required: true,
            attributes: ["name", "email", "phone"],
          },
        },
        {
          model: db.Implementation,
          required: true,
          attributes: [],
          include: [
            {
              model: db.Student,
              as: "Student1",
              include: {
                model: db.User,
                required: true,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
            {
              model: db.Student,
              as: "Student2",
              include: {
                model: db.User,
                required: true,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
          ],
        },
      ],
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
      EM: "Success",
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
};

const getProjectList = async () => {
  try {
    let projectList = await db.Project.findAll({
      include: [
        {
          model: db.Teacher,
          required: true,
          attributes: ["id", "faculty", "academicDegree"],
          include: {
            model: db.User,
            required: true,
            attributes: ["name", "email", "phone"],
          },
        },
        {
          model: db.Implementation,
          required: true,
          attributes: [],
          include: [
            {
              model: db.Student,
              as: "Student1",
              include: {
                model: db.User,
                required: true,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
            {
              model: db.Student,
              as: "Student2",
              include: {
                model: db.User,
                required: true,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
          ],
        },
      ],
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
      EM: "Success",
      EC: 0,
      DT: projectList,
    };
  } catch (error) {
    console.log(">>> check error", error);
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
      include: [
        {
          model: db.Teacher,
          required: true,
          attributes: ["faculty", "academicDegree"],
          include: {
            model: db.User,
            required: true,
            attributes: ["name", "email", "phone"],
          },
        },
        {
          model: db.Implementation,
          required: false,
          attributes: [],
          include: [
            {
              model: db.Student,
              as: "Student1",
              include: {
                model: db.User,
                required: true,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
            {
              model: db.Student,
              as: "Student2",
              include: {
                model: db.User,
                required: true,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
          ],
        },
      ],
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

const updateProject = async (project, projectId) => {
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
    }
    return {
      EM: "Update project successfully",
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

const registerProject = async (student, projectId) => {
  try {
    console.log(">>> check student", student, ", projectId:", projectId);
    const registerData = await db.Project.findOne({
      where: { id: projectId },
    });
    if (registerData) {
      await registerData.update({
        isRegistered: 1,
      });
    }
    // Check if an Implementation exists with student1Id
    let existingImplementation;
    try {
      // Check if a projectId exists in the Implementation table
      existingImplementation = await db.Implementation.findOne({
        where: {
          [Op.and]: [
            { projectID: projectId },
            {
              [Op.or]: [
                { student1ID: student.userId },
                { student2ID: student.userId },
              ],
            },
          ],
        },
      });
      console.log(
        ">>>>>>Project exists in the Implementation table.",
        existingImplementation
      );
      // if (existingImplementation) {
      //   console.log(">>>>>>Project exists in the Implementation table.");

      //   // Check if the corresponding record has a student1ID
      //   if (existingImplementation.student1ID) {
      //     console.log(
      //       "The project has a student1ID: ",
      //       existingImplementation.student1ID
      //     );
      //   } else {
      //     console.log("The project does not have a student1ID.");
      //   }
      // } else {
      //   console.log("Project does not exist in the Implementation table.");
      // }
    } catch (error) {
      console.error(">>>>> An error occurred:", error);
    }
    // let studentData;
    // console.log(">>> checkkk:", existingImplementation);
    // if (existingImplementation) {
    //   // If it exists, create a new Implementation with student2Id
    //   studentData = await db.Implementation.create({
    //     student2ID: student.userId,
    //     projectID: projectId,
    //   });
    // } else {
    //   // If it doesn't exist, create a new Implementation with student1Id
    //   studentData = await db.Implementation.create({
    //     student1ID: student.userId,
    //     projectID: projectId,
    //   });
    // }
    return {
      EM: "Success",
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
  updateProject,
  getProjectById,
  registerProject,
};

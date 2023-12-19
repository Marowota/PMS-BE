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
        include: [
          {
            model: db.Teacher,
            required: true,
            attributes: ["id", "faculty", "academicDegree"],
            include: {
              model: db.User,
              required: true,
              attributes: ["id", "name", "email", "phone"],
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
                  required: false,
                  attributes: ["name"],
                },
                attributes: ["studentCode"],
              },
              {
                model: db.Student,
                as: "Student2",
                include: {
                  model: db.User,
                  required: false,
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

const getProjectList = async ({ teacherUserId, timeId = null }) => {
  ///--------------
  let teacherWhereObject = {};
  if (teacherUserId) {
    teacherWhereObject = { "$Teacher.User.id$": teacherUserId };
  }

  let timeWhereObject = {};
  if (timeId) {
    if (timeId === "#NotSetted") {
      const result = await db.RegisterTime.findAll();
      const timeIds = result.map((timeValue) => {
        return timeValue.id;
      });
      //console.log("timeid", timeIds);
      timeWhereObject = {
        registerTimeID: {
          [Op.or]: [{ [Op.notIn]: timeIds }, { [Op.is]: null }],
        },
      };
    } else {
      timeWhereObject = { registerTimeID: timeId };
    }
  }
  ///--------------
  try {
    let projectList = await db.Project.findAll({
      include: [
        {
          model: db.Teacher,
          required: false,
          attributes: ["id", "faculty", "academicDegree"],
          include: {
            model: db.User,
            required: false,
            attributes: ["id", "name", "email", "phone"],
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
                required: false,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
            {
              model: db.Student,
              as: "Student2",
              include: {
                model: db.User,
                required: false,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
          ],
        },
      ],
      where: [teacherWhereObject, timeWhereObject],
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
      order: [["id", "DESC"]],
    });
    return {
      EM: "Get project list successfully",
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

const getProjectWithPagination = async ({
  page,
  limit,
  search = "",
  teacherUserId = null,
  timeId = null,
  isStudent = false,
}) => {
  try {
    ///--------------

    let teacherWhereObject = {};
    if (teacherUserId) {
      teacherWhereObject = { "$Teacher.User.id$": teacherUserId };
    }

    let timeWhereObject = {};
    if (timeId) {
      if (timeId === "#NotSetted") {
        const result = await db.RegisterTime.findAll();
        const timeIds = result.map((timeValue) => {
          return timeValue.id;
        });
        //console.log("timeid", timeIds);
        timeWhereObject = {
          registerTimeID: {
            [Op.or]: [{ [Op.notIn]: timeIds }, { [Op.is]: null }],
          },
        };
      } else {
        timeWhereObject = { registerTimeID: timeId };
      }
    }

    let inRegisterTimeWhereObject = {};
    if (isStudent) {
      let now = Date.now() + 7 * 60 * 60 * 1000;
      let current = new Date(now);
      inRegisterTimeWhereObject = {
        [Op.and]: [
          { "$RegisterTime.start$": { [Op.lte]: current } },
          { "$RegisterTime.end$": { [Op.gte]: current } },
        ],
      };
    }

    ///----------------
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Project.findAndCountAll({
      include: [
        {
          model: db.Teacher,
          required: false,
          attributes: ["faculty", "academicDegree"],
          include: {
            model: db.User,
            required: false,
            attributes: ["id", "name", "email", "phone"],
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
                required: false,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
            {
              model: db.Student,
              as: "Student2",
              include: {
                model: db.User,
                required: false,
                attributes: ["name"],
              },
              attributes: ["studentCode"],
            },
          ],
        },
        { model: db.RegisterTime },
      ],
      where: [
        {
          [db.Sequelize.col("Project.name")]: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("Project.name")),
            "LIKE",
            "%" + search + "%"
          ),
        },
        teacherWhereObject,
        timeWhereObject,
        inRegisterTimeWhereObject,
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
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
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
    console.log(error);
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
      let result = await db.Project.findOne({
        where: {
          id: {
            [Op.in]: projectIds,
          },
        },
      });
      if (result.isRegistered)
        return {
          EM: "Project is registered, cant delete",
          EC: 1,
          DT: "",
        };
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

const registerProject = async (student, projectId) => {
  try {
    let inRegisterTimeWhereObject = {};
    let now = Date.now() + 7 * 60 * 60 * 1000;
    let current = new Date(now);
    const registerData = await db.Project.findOne({
      include: [{ model: db.RegisterTime }],
      where: [{ id: projectId }],
    });

    if (registerData?.RegisterTime?.start > now) {
      return {
        EM: "This project not open yet for register",
        EC: 1,
        DT: "",
      };
    }
    if (registerData?.RegisterTime?.end < now) {
      console.log("in");
      return {
        EM: "This project has closed for register",
        EC: 1,
        DT: "",
      };
    }

    try {
      let projectIsFull = await db.Implementation.findOne({
        where: {
          [Op.and]: [
            { projectID: projectId },
            { student1ID: { [Op.ne]: null } },
            { student2ID: { [Op.ne]: null } },
          ],
        },
        attributes: ["projectID"],
        raw: true,
        nest: true,
      });
      let findStudentId = await db.Student.findOne({
        where: {
          userId: student.userId,
        },
        attributes: ["id"],
        raw: true,
        nest: true,
      });
      const studentId = findStudentId.id;
      let existingStudent = await db.Implementation.findOne({
        where: {
          [Op.or]: [{ student1ID: studentId }, { student2ID: studentId }],
        },
        attributes: ["student1ID", "student2ID"],
        raw: true,
        nest: true,
      });
      if (
        existingStudent?.student1ID === studentId ||
        existingStudent?.student2ID === studentId
      ) {
        return {
          EM: "You've already joined a project! Please remove the current project before registering a new one.",
          EC: 1,
          DT: "",
        };
      }
      let projectList = await db.Implementation.findOne({
        where: { projectID: projectId },
        attributes: ["projectID", "student1ID", "student2ID"],
        raw: true,
        nest: true,
      });
      // console.log(
      //   ">>>>>>Project exists is full or not: ",
      //   projectIsFull,
      //   ">>> check studentId: ",
      //   findStudentId.id,
      //   " >>> check existing student: ",
      //   existingStudent,
      //   " >>> check project list: projectID:",
      //   projectList.projectID,
      //   ", student1: ",
      //   projectList.student1ID,
      //   ", student2: ",
      //   projectList.student2ID
      // );
      if (
        !projectIsFull &&
        !(existingStudent?.student1ID || existingStudent?.student2ID)
      ) {
        // Check if the corresponding record has a student1ID

        let studentData;
        if (projectList.student1ID) {
          // If it exists, create a new Implementation with student2Id
          studentData = await db.Implementation.update(
            { student2ID: studentId },
            {
              where: {
                projectID: projectId,
              },
            }
          );
        } else {
          // If it doesn't exist, create a new Implementation with student1Id
          studentData = await db.Implementation.update(
            {
              student1ID: studentId,
            },
            {
              where: { projectID: projectId },
            }
          );
        }
        if (registerData) {
          await registerData.update({
            isRegistered: 1,
          });
        }
        return {
          EM: "Register project successfully",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Project is full",
          EC: 1,
          DT: "",
        };
      }
    } catch (error) {
      console.log(">>> check error:", error);
      return {
        EM: "There's something wrong in the services",
        EC: 1,
        DT: "",
      };
    }
  } catch (error) {
    console.log(">>> check error:", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const unregisterProject = async (studentId, projectId) => {
  try {
    await db.Implementation.update(
      {
        student1ID: db.Sequelize.literal(
          `CASE WHEN student1ID = ${studentId} THEN NULL ELSE student1ID END`
        ),
        student2ID: db.Sequelize.literal(
          `CASE WHEN student2ID = ${studentId} THEN NULL ELSE student2ID END`
        ),
      },
      {
        where: {
          projectId: projectId,
        },
      }
    );
    const projectInfo = await db.Implementation.findOne({
      where: { projectID: projectId },
      attributes: ["student1ID", "student2ID"],
      raw: true,
      nest: true,
    });
    if (projectInfo.student1ID === null && projectInfo.student2ID === null) {
      await db.Project.update(
        {
          isRegistered: 0,
        },
        {
          where: {
            id: projectId,
          },
        }
      );
    }
    return {
      EM: "Unregister project successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    console.log(">>> check error:", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getAllTime = async () => {
  try {
    const result = await db.RegisterTime.findAll();
    return {
      EM: "Create time successfully",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const createTime = async (rawData) => {
  try {
    console.log(rawData);
    const result = await db.RegisterTime.create({
      start: rawData.newStart + ":00.000Z",
      end: rawData.newEnd + ":00.000Z",
      faculty: rawData.faculty,
      year: rawData.newYear,
      semester: rawData.newSemester,
    });

    return {
      EM: "Create time successfully",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};
const updateTime = async (rawData) => {
  try {
    console.log(rawData);
    const result = await db.RegisterTime.update(
      {
        start: rawData.newStart + ":00.000Z",
        end: rawData.newEnd + ":00.000Z",
        faculty: rawData.faculty,
        year: rawData.newYear,
        semester: rawData.newSemester,
      },
      { where: { id: rawData.id } }
    );

    return {
      EM: "Create time successfully",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const deleteTime = async (id) => {
  try {
    await db.RegisterTime.destroy({
      where: {
        id: id,
      },
    });
    return {
      EM: "Delete time successfully",
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

const setProjectTime = async (rawData) => {
  try {
    let projectIds = rawData.selectedProject.map((project) => {
      return project.id;
    });
    console.log("project id:", projectIds);
    console.log("time id:", rawData.timeId);

    await db.Project.update(
      { registerTimeID: rawData.timeId },
      { where: { id: projectIds } }
    );
    return {
      EM: "Create time successfully",
      EC: 0,
      DT: result,
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
  isProjectValid,
  deleteProject,
  updateProject,
  getProjectById,
  registerProject,
  unregisterProject,
  getAllTime,
  createTime,
  updateTime,
  deleteTime,
  setProjectTime,
};

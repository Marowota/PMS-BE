import db from "../models/index";

const getTeacherList = async () => {
  try {
    let teacherList = await db.Teacher.findAll({
      include: {
        model: db.User,
        required: true,
        attributes: ["id", "name", "email", "phone"],
      },
      attributes: ["id", "teacherCode", "faculty", "academicDegree"],
      raw: true,
      nest: true,
    });
    return {
      EM: "Get teacher list successfully",
      EC: 0,
      DT: teacherList,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getAnalysisOfTeacher = async (teacherId) => {
  try {
    const projectCount = await db.Project.count({
      where: {
        teacherID: teacherId,
      },
    });

    const studentCount1 = await db.Implementation.count({
      distinct: true,
      col: "student1ID",
      include: {
        model: db.Project,
        required: true,
        where: {
          teacherID: teacherId,
        },
        attributes: [],
      },
    });

    const studentCount2 = await db.Implementation.count({
      distinct: true,
      col: "student2ID",
      include: {
        model: db.Project,
        required: true,
        where: {
          teacherID: teacherId,
        },
        attributes: [],
      },
    });

    const totalStudentCount = studentCount1 + studentCount2;

    const registeredProjectsCount = await db.Project.count({
      where: {
        teacherID: teacherId,
        isRegistered: 1,
      },
    });

    const unregisteredProjectsCount = await db.Project.count({
      where: {
        teacherID: teacherId,
        isRegistered: 0,
      },
    });

    const averageStudentScore = await db.Implementation.findOne({
      attributes: [[db.Sequelize.literal(`ROUND(AVG(score), 1)`), "score"]],
      include: {
        model: db.Project,
        required: true,
        where: {
          teacherID: teacherId,
        },
        attributes: [],
      },
      raw: true,
    });
    const scores = await db.Implementation.findAll({
      attributes: ["score"],
      include: {
        model: db.Project,
        required: true,
        where: {
          teacherID: teacherId,
        },
        attributes: [],
      },
      order: [["score", "DESC"]],
      raw: true,
    });

    const middleElement = Math.floor(scores.length / 2);
    const medianStudentScore = scores[middleElement];

    const data = {
      projectCount,
      totalStudentCount,
      registeredProjectsCount,
      unregisteredProjectsCount,
      avgStudentScore: averageStudentScore.score,
      medianStudentScore: medianStudentScore.score,
    };

    return {
      EM: "Get analysis of teacher successfully",
      EC: 0,
      DT: data,
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

module.exports = {
  getTeacherList,
  getAnalysisOfTeacher,
};

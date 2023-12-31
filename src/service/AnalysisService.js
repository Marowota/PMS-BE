import db from "../models/index.js";

const getStudentByTeacher = async () => {
  try {
    const projects = await db.Project.findAll({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "Project"],
      ],
      group: ["teacherID"],
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty", "teacherCode"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email", "avatarLink", "phone"],
        },
      },
      raw: true,
    });
    //count student1ID
    const implementations1 = await db.Implementation.findAll({
      attributes: [
        [
          db.Sequelize.fn(
            "COUNT",
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("student1ID"))
          ),
          "Student",
        ],
        [db.Sequelize.col("Project.teacherID"), "teacherID"],
      ],
      include: {
        model: db.Project,
        required: true,
        attributes: [],
      },
      group: [db.Sequelize.col("Project.teacherID")],
      raw: true,
    });
    //count student2ID
    const implementations2 = await db.Implementation.findAll({
      attributes: [
        [
          db.Sequelize.fn(
            "COUNT",
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("student2ID"))
          ),
          "Student",
        ],
        [db.Sequelize.col("Project.teacherID"), "teacherID"],
      ],
      include: {
        model: db.Project,
        required: true,
        attributes: [],
      },
      group: [db.Sequelize.col("Project.teacherID")],
      raw: true,
    });
    const result = projects.map((project) => {
      const implementation1 = implementations1.find(
        (implementation) => implementation["teacherID"] === project.teacherID
      );
      const implementation2 = implementations2.find(
        (implementation) => implementation["teacherID"] === project.teacherID
      );
      let implementation = implementation1.Student + implementation2.Student;

      return {
        teacherName: project["Teacher.User.name"],
        email: project["Teacher.User.email"],
        phone: project["Teacher.User.phone"],
        avatar: project["Teacher.User.avatarLink"],
        teacherCode: project["Teacher.teacherCode"],
        faculty: project["Teacher.faculty"],
        studentNum: implementation ? implementation : 0,
      };
    });
    result.sort((a, b) => b.studentNum - a.studentNum);
    return {
      EM: "Success",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    console.log(">>> error: ", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getProjectjAndStudentByTeacher = async () => {
  try {
    const projects = await db.Project.findAll({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "Project"],
      ],
      group: ["teacherID"],
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email"],
        },
      },
      raw: true,
    });
    //count student1ID
    const implementations1 = await db.Implementation.findAll({
      attributes: [
        [
          db.Sequelize.fn(
            "COUNT",
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("student1ID"))
          ),
          "Student",
        ],
        [db.Sequelize.col("Project.teacherID"), "teacherID"],
      ],
      include: {
        model: db.Project,
        required: true,
        attributes: [],
      },
      group: [db.Sequelize.col("Project.teacherID")],
      raw: true,
    });
    //count student2ID
    const implementations2 = await db.Implementation.findAll({
      attributes: [
        [
          db.Sequelize.fn(
            "COUNT",
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("student2ID"))
          ),
          "Student",
        ],
        [db.Sequelize.col("Project.teacherID"), "teacherID"],
      ],
      include: {
        model: db.Project,
        required: true,
        attributes: [],
      },
      group: [db.Sequelize.col("Project.teacherID")],
      raw: true,
    });

    const result = projects.map((project) => {
      const implementation1 = implementations1.find(
        (implementation) => implementation["teacherID"] === project.teacherID
      );
      const implementation2 = implementations2.find(
        (implementation) => implementation["teacherID"] === project.teacherID
      );
      let implementation = implementation1.Student + implementation2.Student;

      return {
        ...project,
        Student: implementation ? implementation : 0,
      };
    });

    return {
      EM: "Success",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    console.log(">>> error: ", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};
const getTeacherWithMostProjects = async () => {
  try {
    const teacherWithMostProjects = await db.Project.findOne({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "projectCount"],
      ],
      group: ["teacherID"],
      order: [[db.Sequelize.literal("projectCount"), "DESC"]],
      limit: 1,
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name"],
        },
      },
      raw: true,
    });
    return {
      EM: "Success",
      EC: 0,
      DT: teacherWithMostProjects,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getTeacherWithMostStudents = async () => {
  try {
    const projects = await db.Project.findAll({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "Project"],
      ],
      group: ["teacherID"],
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name"],
        },
      },
      raw: true,
    });
    //count student1ID
    const implementations1 = await db.Implementation.findAll({
      attributes: [
        [
          db.Sequelize.fn(
            "COUNT",
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("student1ID"))
          ),
          "Student",
        ],
        [db.Sequelize.col("Project.teacherID"), "teacherID"],
      ],
      include: {
        model: db.Project,
        required: true,
        attributes: [],
      },
      group: [db.Sequelize.col("Project.teacherID")],
      raw: true,
    });
    //count student2ID
    const implementations2 = await db.Implementation.findAll({
      attributes: [
        [
          db.Sequelize.fn(
            "COUNT",
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("student2ID"))
          ),
          "Student",
        ],
        [db.Sequelize.col("Project.teacherID"), "teacherID"],
      ],
      include: {
        model: db.Project,
        required: true,
        attributes: [],
      },
      group: [db.Sequelize.col("Project.teacherID")],
      raw: true,
    });
    const result = projects.map((project) => {
      const implementation1 = implementations1.find(
        (implementation) => implementation["teacherID"] === project.teacherID
      );
      const implementation2 = implementations2.find(
        (implementation) => implementation["teacherID"] === project.teacherID
      );
      let implementation = implementation1.Student + implementation2.Student;
      return {
        ...project,
        Student: implementation ? implementation : 0,
      };
    });
    result.sort((a, b) => b.Student - a.Student);
    return {
      EM: "Success",
      EC: 0,
      DT: result[0],
    };
  } catch (error) {
    console.log(">>> error: ", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getProjectRegisterStatus = async () => {
  try {
    //count registered project
    const registered_projects = await db.Project.findAll({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "Registered"],
      ],
      where: {
        isRegistered: 1,
      },
      group: ["teacherID"],
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email"],
        },
      },
      raw: true,
    });
    //count unregistered project
    const unregistered_projects = await db.Project.findAll({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "Unregistered"],
      ],
      where: {
        isRegistered: 0,
      },
      group: ["teacherID"],
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name"],
        },
      },
      raw: true,
    });
    // Merge projects_1 and projects_2 into a single array
    const result = registered_projects.map((registered_projects, index) => {
      const unregistered_project = unregistered_projects[index];
      return {
        ...registered_projects,
        Unregistered: unregistered_project
          ? unregistered_project.Unregistered
          : 0,
      };
    });

    return {
      EM: "Success",
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

const getTeacherWithMostProjectsRegistered = async () => {
  try {
    //count registered project
    const registered_projects = await db.Project.findAll({
      attributes: [
        "teacherID",
        [db.Sequelize.fn("COUNT", "teacherID"), "Registered"],
      ],
      where: {
        isRegistered: 1,
      },
      group: ["teacherID"],
      order: [[db.Sequelize.literal("Registered"), "DESC"]],
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name"],
        },
      },
      raw: true,
    });
    return {
      EM: "Success",
      EC: 0,
      DT: registered_projects[0],
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const teacherAverageScore = async () => {
  try {
    // CODE CHECK PROJECT ID

    // const teachers = await db.Implementation.findAll({
    //   attributes: [
    //     "projectID",
    //     [db.Sequelize.fn("AVG", db.Sequelize.col("score")), "averageScore"],
    //     [db.Sequelize.col("Project->Teacher->User.name"), "teacherName"],
    //   ],
    //   include: [
    //     {
    //       model: db.Project,
    //       attributes: [],
    //       include: {
    //         model: db.Teacher,
    //         attributes: [],
    //         include: {
    //           model: db.User,
    //           attributes: [],
    //         },
    //       },
    //     },
    //   ],
    //   group: ["projectID", db.Sequelize.col("Project->Teacher->User.name")],
    //   raw: true,
    // });

    const teachers = await db.Implementation.findAll({
      attributes: [
        [db.Sequelize.col("Project.Teacher.User.name"), "Teacher's name"],
        [
          db.Sequelize.literal(`ROUND(AVG(score), 1)`),
          "Average student's score",
        ],
      ],
      include: [
        {
          model: db.Project,
          attributes: [],
          include: {
            model: db.Teacher,
            attributes: ["faculty"],
            include: {
              model: db.User,
              attributes: ["email"],
            },
          },
        },
      ],
      group: ["Project.Teacher.userID"],
      raw: true,
    });

    // CODE CHECK TEACHER ID

    // const teachers = await db.Implementation.findAll({
    //   attributes: [
    //     [db.Sequelize.fn("AVG", db.Sequelize.col("score")), "averageScore"],
    //   ],
    //   include: [
    //     {
    //       model: db.Project,
    //       attributes: [],
    //       include: {
    //         model: db.Teacher,
    //         attributes: [],
    //         include: {
    //           model: db.User,
    //           attributes: ["name"],
    //         },
    //       },
    //     },
    //   ],
    //   group: ["Project.Teacher.userID", "Project.Teacher.User.name"],
    //   raw: true,
    // });

    return {
      EM: "Success",
      EC: 0,
      DT: teachers,
    };
  } catch (error) {
    console.log(">>> error: ", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const highestAverageScore = async () => {
  try {
    // Find the teacher with the highest average score
    const teacher = await db.Implementation.findOne({
      attributes: [
        [db.Sequelize.col("Project.Teacher.User.name"), "teacherName"],
        [db.Sequelize.literal(`ROUND(AVG(score), 1)`), "averageScore"],
      ],
      include: [
        {
          model: db.Project,
          attributes: [],
          include: {
            model: db.Teacher,
            attributes: ["faculty"],
            include: {
              model: db.User,
              attributes: ["email"],
            },
          },
        },
      ],
      group: [
        "Project.Teacher.userID",
        db.Sequelize.col("Project.Teacher.User.name"),
      ],
      order: [[db.Sequelize.literal("averageScore"), "DESC"]],
      limit: 1,
      raw: true,
    });

    return {
      EM: "Success",
      EC: 0,
      DT: teacher,
    };
  } catch (error) {
    console.log(">>> error: ", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

module.exports = {
  getStudentByTeacher,
  getProjectjAndStudentByTeacher,
  getTeacherWithMostProjects,
  getTeacherWithMostStudents,
  getProjectRegisterStatus,
  getTeacherWithMostProjectsRegistered,
  teacherAverageScore,
  highestAverageScore,
};

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

module.exports = {
  getTeacherList,
};

import db from "../models/index";

const getTeacherList = async () => {
  try {
    let teacherList = await db.Teacher.findAll({
      include: {
        model: db.User,
        required: true,
        attributes: ["name", "email", "phone"],
      },
      attributes: ["id", "teacherCode", "faculty", "academicDegree"],
      raw: true,
      nest: true,
    });
    console.log(">>> check teacherList:", teacherList);
    return {
      EM: "Success",
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

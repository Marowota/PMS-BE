import db from "../models";

const getUserByID = async (userId) => {
  try {
    const user = await db.Account.findOne({
      include: {
        model: db.User,
        where: {
          id: userId,
        },
        attributes: ["email", "name", "phone", "dateOfBirth"],
      },
      attributes: ["id", "role", "username"],
    });
    let data = {};
    let role = user?.role;
    switch (role) {
      case "student": {
        data = await db.Student.findOne({
          where: {
            userID: userId,
          },
          attributes: ["id", "studentCode", "major"],
        });
        break;
      }
      case "teacher": {
        data = await db.Teacher.findOne({
          where: {
            userID: userId,
          },
          attributes: ["id", "teacherCode", "faculty"],
        });
        break;
      }
    }
    const userData = { ...user?.dataValues, ...data.dataValues, role };
    return {
      EM: "Get user successfully",
      EC: 0,
      DT: userData,
    };
  } catch (error) {
    console.log(">>> check error:", error);
    return {
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

module.exports = { getUserByID };

import db from "../models";

const getUserByID = async (userId) => {
  if (typeof userId !== "number" || userId < 1) {
    return {
      EM: "User id is invalid",
      EC: 19,
      DT: "",
    };
  } else {
    try {
      const user = await db.Account.findOne({
        include: {
          model: db.User,
          where: {
            id: userId,
          },
          attributes: ["email", "name", "phone", "dateOfBirth", "avatarLink"],
        },
        attributes: ["id", "role", "username"],
      });
      if (!user) {
        return {
          EM: "User not found",
          EC: 20,
          DT: "",
        };
      }
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
        case "aa": {
          data = await db.AcademicAffair.findOne({
            where: {
              userID: userId,
            },
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
  }
};

const updateUserById = async (userId, userData) => {
  if (typeof userId !== "number" || userId < 1) {
    return {
      EM: "User id is invalid",
      EC: 19,
      DT: "",
    };
  } else if (typeof userData !== "object") {
    return {
      EM: "User data is invalid",
      EC: 21,
      DT: "",
    };
  } else {
    try {
      let data = await db.User.update(
        { ...userData },
        { where: { id: userId } }
      );
      await db.Account.update(
        { username: userData.username },
        { where: { userID: userId } }
      );
      return {
        EM: "Update user successfully",
        EC: 0,
        DT: data,
      };
    } catch (error) {
      console.log(">>> check error:", error);
      return {
        EM: "There is something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

module.exports = { getUserByID, updateUserById };

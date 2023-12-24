import db from "../models/index";
import { Op, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  console.log("hashPassword", hashPassword);
  return hashPassword;
};

const getAccountPagination = async (page, limit, search = "") => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Account.findAndCountAll({
      attributes: ["id", "username", "role"],
      include: [
        {
          model: db.User,
          attributes: ["email", "name", "phone"],
          include: [
            {
              model: db.AcademicAffair,
              required: false,
            },
            {
              model: db.Student,
              required: false,
            },
            {
              model: db.Teacher,
              required: false,
            },
          ],
        },
      ],
      where: {
        [Op.or]: {
          username: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("username")),
            "LIKE",
            "%" + search + "%"
          ),
          "$User.name$": Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("User.name")),
            "LIKE",
            "%" + search + "%"
          ),
        },
      },
      raw: true,
      nest: true,
      offset: offset,
      limit: limit,
    });

    let totalPage = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPage,
      account: rows,
    };

    return {
      EM: "Get account pagination successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getAccountById = async (id) => {
  if (typeof id !== "number" || id < 1) {
    return {
      EM: "Invalid account id",
      EC: 31,
      DT: "",
    };
  }
  try {
    const result = await db.Account.findOne({
      attributes: ["id", "username", "role", "userID"],
      include: [
        {
          model: db.User,
          attributes: ["email", "name", "phone", "dateOfBirth"],
          include: [
            {
              model: db.AcademicAffair,
              required: false,
            },
            {
              model: db.Student,
              required: false,
            },
            {
              model: db.Teacher,
              required: false,
            },
          ],
        },
      ],
      where: {
        id: id,
      },
      raw: true,
      nest: true,
    });

    if (!result) {
      return {
        EM: "Account not found",
        EC: 32,
        DT: "",
      };
    }

    return {
      EM: "Get account info successfully",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const createAccount = async (rawData) => {
  console.log("creating account", rawData);
  let accountExist = await db.Account.findOne({
    attributes: ["id"],
    where: { username: rawData.account.username },
    raw: true,
    nest: true,
  });
  if (accountExist) {
    return {
      EM: "Username already exist",
      EC: -2,
      DT: "",
    };
  }
  try {
    let userInfo = await db.User.create({
      email: rawData.user.email,
      name: rawData.user.name,
      dateOfBirth: rawData.user.dateOfBirth,
      phone: rawData.user.phone,
    });
    let accountInfo = await db.Account.create({
      username: rawData.account.username,
      password: hashUserPassword(rawData.account.password),
      role: rawData.role.value,
      userID: userInfo.id,
    });
    switch (accountInfo.role) {
      case "aa":
        await db.AcademicAffair.create({
          academicAffairCode: rawData.role.aa.code,
          faculty: rawData.role.aa.faculty,
          userID: userInfo.id,
        });
        break;
      case "teacher":
        await db.Teacher.create({
          teacherCode: rawData.role.teacher.code,
          faculty: rawData.role.teacher.faculty,
          academicDegree: rawData.role.teacher.academicDegree,
          userID: userInfo.id,
        });
        break;
      case "student":
        await db.Student.create({
          studentCode: rawData.role.student.code,
          classID: rawData.role.student.class,
          major: rawData.role.student.major,
          userID: userInfo.id,
        });
        break;
    }
    return {
      EM: "New account created successfully",
      EC: 0,
      DT: "",
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

const updateAccount = async (id, rawData) => {
  console.log("updating id: ", id);
  console.log("updating: ", rawData);
  let accountExist = await db.Account.findOne({
    attributes: ["id"],
    where: {
      [Op.and]: [
        { username: rawData.account.username },
        { id: { [Op.ne]: id } },
      ],
    },
    raw: true,
    nest: true,
  });
  if (accountExist) {
    return {
      EM: "Username already exist",
      EC: -2,
      DT: "",
    };
  }
  try {
    await db.User.update(
      {
        email: rawData.user.email,
        name: rawData.user.name,
        dateOfBirth: rawData.user.dateOfBirth,
        phone: rawData.user.phone,
      },
      { where: { id: rawData.user.id } }
    );
    await db.Account.update(
      {
        username: rawData.account.username,
        password: hashUserPassword(rawData.account.password),
        role: rawData.role.value,
        userID: rawData.user.id,
      },
      { where: { id: rawData.account.id } }
    );

    const removeData = async () => {
      if (rawData.role.aa.id) {
        await db.AcademicAffair.destroy({ where: { id: rawData.role.aa.id } });
      }
      if (rawData.role.teacher.id) {
        await db.Teacher.destroy({ where: { id: rawData.role.teacher.id } });
      }
      if (rawData.role.student.id) {
        await db.Student.destroy({ where: { id: rawData.role.student.id } });
      }
    };

    switch (rawData.role.value) {
      case "aa":
        if (rawData.role.aa.id) {
          await db.AcademicAffair.update(
            {
              academicAffairCode: rawData.role.aa.code,
              faculty: rawData.role.aa.faculty,
              userID: rawData.user.id,
            },
            { where: { id: rawData.role.aa.id } }
          );
        } else {
          await removeData();
          await db.AcademicAffair.create({
            academicAffairCode: rawData.role.aa.code,
            faculty: rawData.role.aa.faculty,
            userID: rawData.user.id,
          });
        }
        break;

      case "teacher":
        if (rawData.role.teacher.id) {
          await db.Teacher.update(
            {
              teacherCode: rawData.role.teacher.code,
              faculty: rawData.role.teacher.faculty,
              academicDegree: rawData.role.teacher.academicDegree,
              userID: rawData.user.id,
            },
            { where: { id: rawData.role.teacher.id } }
          );
        } else {
          await removeData();
          await db.Teacher.create({
            teacherCode: rawData.role.teacher.code,
            faculty: rawData.role.teacher.faculty,
            academicDegree: rawData.role.teacher.academicDegree,
            userID: rawData.user.id,
          });
        }
        break;

      case "student":
        if (rawData.role.student.id) {
          await db.Student.update(
            {
              studentCode: rawData.role.student.code,
              classID: rawData.role.student.class,
              major: rawData.role.student.major,
              userID: rawData.user.id,
            },
            { where: { id: rawData.role.student.id } }
          );
        } else {
          await removeData();
          await db.Student.create({
            studentCode: rawData.role.student.code,
            classID: rawData.role.student.class,
            major: rawData.role.student.major,
            userID: rawData.user.id,
          });
        }
        break;

      default:
        removeData();
    }
    return {
      EM: "Update account successfully",
      EC: 0,
      DT: "",
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

const deleteAccount = async (accountIds) => {
  try {
    await db.Account.destroy({
      where: {
        id: {
          [Op.in]: accountIds,
        },
      },
    });
    return {
      EM: "Delete account successfully",
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
  getAccountPagination,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};

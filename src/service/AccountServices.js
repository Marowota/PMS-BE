import db from "../models/index";
import { Op, Sequelize } from "sequelize";

const getAccountPagination = async (page, limit, search = "") => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Account.findAndCountAll({
      attributes: ["id", "username", "password", "role"],
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
      password: rawData.account.password,
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
          class: rawData.role.student.class,
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

module.exports = {
  getAccountPagination,
  createAccount,
};
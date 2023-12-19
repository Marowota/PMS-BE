import db from "../models/index";
import { Sequelize, Op } from "sequelize";
const getScoreList = async ({ timeId = null, teacherUserId = null }) => {
  try {
    let teacherWhereObject = {};
    if (teacherUserId) {
      teacherWhereObject = { "$Project.Teacher.User.id$": teacherUserId };
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
          "$Project.registerTimeID$": {
            [Op.or]: [{ [Op.notIn]: timeIds }, { [Op.is]: null }],
          },
        };
      } else {
        timeWhereObject = { "$Project.registerTimeID$": timeId };
      }
    }

    let scoreList = await db.Implementation.findAll({
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
        {
          model: db.Project,
          required: true,
          include: {
            model: db.Teacher,
            required: true,
            include: {
              model: db.User,
              required: true,
              attributes: ["name"],
            },
          },
          attributes: ["name", "type", "faculty"],
        },
      ],
      where: [
        {
          [Op.or]: [
            { student1ID: { [Op.ne]: null } },
            { student2ID: { [Op.ne]: null } },
          ],
        },
        timeWhereObject,
        teacherWhereObject,
      ],
      attributes: ["id", "score", "isCompleted"],
      raw: true,
      nest: true,
    });
    return {
      EM: "Get score list successfully",
      EC: 0,
      DT: scoreList,
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

const getScoreById = async (id) => {
  if (typeof id !== "number" || id <= 0) {
    return {
      EM: "Score id is invalid",
      EC: 7,
      DT: "",
    };
  } else {
    try {
      let score = await db.Implementation.findOne({
        where: { id: id },
        attributes: ["id", "score", "isCompleted"],
        raw: true,
        nest: true,
      });
      if (!score) {
        return {
          EM: "Score not found",
          EC: 8,
          DT: "",
        };
      } else
        return {
          EM: "Get score by id successfully",
          EC: 0,
          DT: score,
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

const getScorePagination = async ({
  page,
  limit,
  search = "",
  timeId = null,
  teacherUserId = null,
}) => {
  try {
    let teacherWhereObject = {};
    if (teacherUserId) {
      teacherWhereObject = { "$Project.Teacher.User.id$": teacherUserId };
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
          "$Project.registerTimeID$": {
            [Op.or]: [{ [Op.notIn]: timeIds }, { [Op.is]: null }],
          },
        };
      } else {
        timeWhereObject = { "$Project.registerTimeID$": timeId };
      }
    }

    let offset = (page - 1) * limit;
    const { count, rows } = await db.Implementation.findAndCountAll({
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
        {
          model: db.Project,
          required: true,
          include: {
            model: db.Teacher,
            required: true,
            include: {
              model: db.User,
              required: true,
              attributes: ["name"],
            },
          },
          where: {
            name: Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("Project.name")),
              "LIKE",
              "%" + search + "%"
            ),
          },
          attributes: ["name", "type", "faculty"],
        },
      ],
      where: {
        [Op.and]: [
          {
            name: Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("Project.name")),
              "LIKE",
              "%" + search + "%"
            ),
          },
          {
            [Op.or]: [
              { student1ID: { [Op.ne]: null } },
              { student2ID: { [Op.ne]: null } },
            ],
          },
          timeWhereObject,
          teacherWhereObject,
        ],
      },
      attributes: ["id", "score", "isCompleted"],
      raw: true,
      nest: true,
      offset: offset,
      limit: limit,
    });

    let totalPage = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPage,
      scores: rows,
    };

    return {
      EM: "Get score pagination successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

// const createScore = async (rawData) => {
//   try {
//     // not implemented

//     return {
//       EM: "Not implemented",
//       EC: -1,
//       DT: "",
//     };
//   } catch (error) {
//     return {
//       EM: "There are something wrong in the server's services",
//       EC: -1,
//       DT: "",
//     };
//   }
// };

const updateScore = async (score, implementationId) => {
  try {
    const oldImplementation = await db.Implementation.findOne({
      where: { id: implementationId },
    });
    if (oldImplementation) {
      await oldImplementation.update({
        score: score,
      });
    }
    return {
      EM: "Update score successfully",
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

// const deleteScore = async (scoreIds) => {
//   try {
//     console.log(">>> check score Ids", scoreIds);
//     await db.Implementation.destroy({
//       where: {
//         id: scoreIds,
//       },
//     });
//     return {
//       EM: "Delete Score successfully",
//       EC: 0,
//       DT: "",
//     };
//   } catch (error) {
//     return {
//       EM: "There are something wrong in the server's services",
//       EC: -1,
//       DT: "",
//     };
//   }
// };

module.exports = {
  getScoreList,
  getScorePagination,
  getScoreById,
  updateScore,
};

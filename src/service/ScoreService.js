import db from "../models/index";
import { Sequelize } from "sequelize";
const getScoreList = async () => {
  console.log("im");
  try {
    let scoreList = await db.Implementation.findAll({
      include: [
        {
          model: db.Student,
          required: true,
          include: {
            model: db.User,
            required: true,
            attributes: ["name"],
          },
          attributes: ["studentCode"],
        },
        {
          model: db.Project,
          as: "pj",
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
          attributes: ["type"],
        },
      ],
      attributes: ["id", "score", "isCompleted"],
      raw: true,
      nest: true,
      group: "pj.name",
    });
    return {
      EM: "Success",
      EC: 0,
      DT: scoreList,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getScoreById = async (id) => {
  try {
    let score = await db.Implementation.findOne({
      where: { id: id },
      attributes: ["id", "score", "isCompleted"],
      raw: true,
      nest: true,
    });

    return {
      EM: "Success",
      EC: 0,
      DT: score,
    };
  } catch (error) {
    console.log(">>> ", error);
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getScorePagination = async (page, limit, search = "") => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Implementation.findAndCountAll({
      include: [
        {
          model: db.Student,
          required: true,
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
      attributes: ["id", "score", "isCompleted"],
      raw: true,
      nest: true,
      offset: offset,
      limit: limit,
    });

    console.log("rows", rows);
    let totalPage = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPage,
      scores: rows,
    };

    return {
      EM: "Get data successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">> error", error);
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

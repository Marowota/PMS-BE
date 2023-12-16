import { Op } from "sequelize";
import db from "../models/index";

const getAllClass = async () => {
  try {
    const result = await db.ClassInfo.findAll();
    return {
      EM: "Get class info successfully",
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

const addNewClass = async (data) => {
  try {
    const result = await db.ClassInfo.create({
      className: data.newClass,
    });
    return {
      EM: "Add class info successfully",
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

const deleteClassService = async (classIds) => {
  console.log(classIds);
  let check = 0;

  classIds.forEach((id) => {
    if (typeof id !== "number") check += 1;
  });

  if (classIds.length === 0 || classIds === undefined || classIds === null) {
    return {
      EM: "classIds id list must not be empty",
      EC: 5,
      DT: "",
    };
  } else if (check !== 0) {
    return {
      EM: "Invalid class id",
      EC: 1,
      DT: "",
    };
  } else {
    try {
      await db.ClassInfo.destroy({
        where: {
          id: { [Op.in]: classIds },
        },
      });
      return {
        EM: "Delete class successfully",
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
  }
};

module.exports = { getAllClass, addNewClass, deleteClassService };

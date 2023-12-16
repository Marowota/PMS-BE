import db from "../models/index";

const getAllClass = async () => {
  try {
    const result = await db.ClassInfo.findAll();
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

module.exports = { getAllClass };

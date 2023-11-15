const db = require("../models/index");

const getPjList = async () => {
  try {
    let pjList = await db.Project.findAll();
    return {
      EM: "Success",
      EC: 1,
      DT: pjList,
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
  getPjList,
};

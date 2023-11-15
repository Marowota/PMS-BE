const db = require("../models/index");

const getPjList = async () => {
  try {
    let pjList = await db.Project.findAll({
      include: {
        model: db.Teacher,
        required: true,
        attributes: ["faculty"],
        include: {
          model: db.User,
          required: true,
          attributes: ["name", "email"],
        },
      },
      attributes: ["id", "name", "type", "faculty"],
      raw: true,
      nest: true,
    });
    return {
      EM: "Success",
      EC: 0,
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

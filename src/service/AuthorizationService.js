import db from "../models/index";

const getRole = async (id = "") => {
  try {
    let result = await db.Account.findOne({
      attributes: ["role", "userID"],
      where: { id: id },
      raw: true,
      nest: true,
    });
    if (result === null) {
      return {
        EM: "Account not found",
        EC: -2,
        DT: "",
      };
    }
    console.log(result);
    return {
      EM: "Success",
      EC: 0,
      DT: result,
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
  getRole,
};

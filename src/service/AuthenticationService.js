import db from "../models/index";

const AccountVerification = async (username, password) => {
  try {
    let result = await db.Account.findOne({
      attributes: ["id"],
      where: { username: username, password: password },
    });
    if (result === null) {
      return {
        EM: "Username or password is incorrect",
        EC: -2,
        DT: "",
      };
    }
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
  AccountVerification,
};

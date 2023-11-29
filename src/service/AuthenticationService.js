import db from "../models/index";

const AccountVerification = async (username = "", password = "") => {
  try {
    let result = await db.Account.findOne({
      attributes: ["id"],
      where: { username: username, password: password },
    });
    console.log(result);
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

const InsertRefreshToken = async (refreshToken = "") => {
  try {
    await db.JWTData.create({
      refreshToken: refreshToken,
    });
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

const RefreshTokenVerification = async (refreshToken = "") => {
  try {
    let result = await db.JWTData.findOne({
      where: { refreshToken: refreshToken },
    });
    if (result === null) {
      return {
        EM: "Refresh Token not exist",
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

const RemoveRefreshToken = async (refreshToken = "") => {
  try {
    await db.JWTData.destroy({
      where: { refreshToken: refreshToken },
    });
    return {
      EM: "Logged out successfully",
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
  InsertRefreshToken,
  RefreshTokenVerification,
  RemoveRefreshToken,
};

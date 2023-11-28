const jwt = require("jsonwebtoken");
require("dotenv").config();
import AuthenticationService from "../service/AuthenticationService";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
};

const login = async (req, res) => {
  try {
    const avResult = await AuthenticationService.AccountVerification(
      req.body.username,
      req.body.password
    );
    if (avResult.EC === 0) {
      const user = { id: avResult.id };
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      const token = { accessToken: accessToken, refreshToken: refreshToken };
      res.status(200).json({
        EM: "Log in successfully",
        EC: 0,
        DT: token,
      });
    } else return avResult;
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

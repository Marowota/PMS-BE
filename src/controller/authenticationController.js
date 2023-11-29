const jwt = require("jsonwebtoken");
require("dotenv").config();
import AuthenticationService from "../service/AuthenticationService";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "12h" });
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
      AuthenticationService.InsertRefreshToken(refreshToken);

      const token = { accessToken: accessToken, refreshToken: refreshToken };
      return res.status(200).json({
        EM: "Login successfully",
        EC: 0,
        DT: token,
      });
    } else return res.status(401).json(avResult);
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const getToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null)
    return res.status(401).json({
      EM: "Please login",
      EC: -4,
      DT: "",
    });
  const tokenQuery = await AuthenticationService.RefreshTokenVerification(
    refreshToken
  );
  if (tokenQuery.EC != 0)
    return res.status(403).json({
      EM: "Please login again",
      EC: -5,
      DT: "",
    });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        EM: "Please login again",
        EC: -6,
        DT: "",
      });
    const accessToken = generateAccessToken({ username: user.username });
    return res.status(200).json({
      EM: "",
      EC: 0,
      DT: { accessToken: accessToken },
    });
  });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

const logout = async (req, res) => {
  await AuthenticationService.RemoveRefreshToken(req.body.refreshToken);
  return res.sendStatus(204);
};

module.exports = {
  login,
  getToken,
  logout,
  authenticateToken,
};

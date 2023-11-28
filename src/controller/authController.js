const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const user = await userModel.getUser(username);
  if (user) res.status(409).send("Tên tài khoản đã tồn tại.");
  else {
    const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    const newUser = {
      username: username,
      password: hashPassword,
    };
    const createUser = await userModel.createUser(newUser);
    if (!createUser) {
      return res
        .status(400)
        .send("Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.");
    }
    return res.send({
      username,
    });
  }
};

const posts = async (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "posts created...",
        authData,
      });
    }
  });
};

const login = async (req, res) => {
  const user = {
    id: 1,
    username: "Manh",
    email: "John@gmail.com",
  };

  jwt.sign({ user: user }, "secret", (err, token) => {
    res.json({
      accessToken: accessToken,
    });
  });
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

const login2 = async (req, res) => {
  const user = {
    id: 1,
    username: "HA",
    email: "John@gmail.com",
  };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
};

const posts2 = [
  {
    username: "Manh",
    title: "di ngu",
  },
  {
    username: "HA",
    title: "tho code da thu",
  },
];

const post2 = async (req, res) => {
  //console.log(req);
  res.json(posts2.filter((posts2) => posts2.username === req.user.username));
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

const login3 = (req, res) => {
  const username = req.body.username;
  const user = { username: "Manh" };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

module.exports = {
  register,
  login,
  posts,
  verifyToken,
  login2,
  post2,
  authenticateToken,
  login3,
};

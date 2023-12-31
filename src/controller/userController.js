import userServices from "../service/UserServices";

const getUserById = async (req, res) => {
  try {
    let data = await userServices.getUserByID(+req.query.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const putUpdateUser = async (req, res) => {
  console.log(
    ">> check req.body:",
    req.body,
    ", req.params.id:",
    req.params.id
  );
  try {
    let data = await userServices.updateUserById(+req.params.id, req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = { getUserById, putUpdateUser };

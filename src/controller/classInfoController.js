const ClassInfoService = require("../service/ClassInfoService");

const getAllClass = async (req, res) => {
  try {
    const result = await ClassInfoService.getAllClass();
    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = { getAllClass };

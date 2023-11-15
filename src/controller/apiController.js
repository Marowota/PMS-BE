const aaService = require("../service/AcademicAffairService");
const pjService = require("../service/ProjectService");

const testAA = () => {
  aaService.getAAById(1);
  aaService.getAAList(true);
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await pjService.getPjList();
    return res.status(200).json({
      EM: projects.EM,
      EC: projects.EC,
      DT: projects.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  testAA,
  getAllProjects,
};

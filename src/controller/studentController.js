import StudentServices from "../service/StudentServices";

const getStudentProject = async (req, res) => {
  try {
    const data = await StudentServices.getProjectOfStudent(+req.query.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = { getStudentProject };

import teacherService from "../service/TeacherService";

const getAllTeacher = async (req, res) => {
  try {
    const teachers = await teacherService.getTeacherList();
    return res.status(200).json({
      EM: teachers.EM,
      EC: teachers.EC,
      DT: teachers.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const getAnalysisDataOfTeacher = async (req, res) => {
  try {
    const data = await teacherService.getAnalysisOfTeacher(+req.query.id);
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

module.exports = {
  getAllTeacher,
  getAnalysisDataOfTeacher,
};

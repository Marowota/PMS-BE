import analysisService from "../service/AnalysisService";

const getStudentsByTeacher = async (req, res) => {
  try {
    const data = await analysisService.getStudentByTeacher();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(">>> check error:", error);
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const getProjectjAndStudent = async (req, res) => {
  try {
    const data = await analysisService.getProjectjAndStudentByTeacher();
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

const getTheMostProject = async (req, res) => {
  try {
    let data = await analysisService.getTeacherWithMostProjects();
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

const getTheMostStudent = async (req, res) => {
  try {
    let data = await analysisService.getTeacherWithMostStudents();
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

const getProjectRegisterStatus = async (req, res) => {
  try {
    const data = await analysisService.getProjectRegisterStatus();
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

const getTheMostRegisteredTeacher = async (req, res) => {
  try {
    const data = await analysisService.getTeacherWithMostProjectsRegistered();
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

const getTeacherAverageScore = async (req, res) => {
  try {
    const data = await analysisService.teacherAverageScore();
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

const getHighestAverageScore = async (req, res) => {
  try {
    const data = await analysisService.highestAverageScore();
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
  getStudentsByTeacher,
  getProjectjAndStudent,
  getTheMostProject,
  getTheMostStudent,
  getProjectRegisterStatus,
  getTheMostRegisteredTeacher,
  getTeacherAverageScore,
  getHighestAverageScore,
};

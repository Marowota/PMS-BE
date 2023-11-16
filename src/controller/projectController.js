import projectService from "../service/ProjectService";

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjectList();
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

const postCreateProject = async (req, res) => {
  try {
    let projectData = await projectService.createProject(req.body);
    return res.status(200).json({
      EM: projectData.EM,
      EC: projectData.EC,
      DT: projectData.DT,
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
  getAllProjects,
  postCreateProject,
};

import ProjectService from "../service/ProjectService";

const getAllProjects = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let data = await ProjectService.getProjectWithPagination(page, limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      const projects = await ProjectService.getProjectList();
      return res.status(200).json({
        EM: projects.EM,
        EC: projects.EC,
        DT: projects.DT,
      });
    }
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
    let projectData = await ProjectService.createProject(req.body);
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

const handleDeleteProject = async (req, res) => {
  try {
    console.log(">>> req.body", req.body);
    let deleteInfo = await ProjectService.deleteProject(req.body.projectIds);
    return res.status(200).json({
      EM: deleteInfo.EM,
      EC: deleteInfo.EC,
      DT: deleteInfo.DT,
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
  handleDeleteProject,
};

import ProjectService from "../service/ProjectService";

const getProjectById = async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(+req.query.projectId);
    return res.status(200).json({
      EM: project.EM,
      EC: project.EC,
      DT: project.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let data;
      if (req.query.teacherId) {
        let teacherId = req.query.teacherId;
        let search = req.query.search;
        data = await ProjectService.getProjectWithPagination(
          page,
          limit,
          search,
          teacherId
        );
      } else if (req.query.search) {
        let search = req.query.search;
        data = await ProjectService.getProjectWithPagination(
          page,
          limit,
          search
        );
      } else {
        data = await ProjectService.getProjectWithPagination(page, limit);
      }
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let projects;
      if (req.query.teacherId) {
        let teacherId = req.query.teacherId;
        projects = await ProjectService.getProjectList(teacherId);
      } else {
        projects = await ProjectService.getProjectList();
      }
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
    let projectData = await ProjectService.createProject({
      projectName: req.body.projectName,
      projectType: String(req.body.projectType),
      projectFaculty: req.body.projectFaculty,
      teacherId: Number(req.body.teacherId),
      projectRequirement: req.body.projectRequirement,
    });
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

const putUpdateProject = async (req, res) => {
  try {
    let updateInfo = await ProjectService.updateProject(
      req.body,
      +req.params.id
    );
    return res.status(200).json({
      EM: updateInfo.EM,
      EC: updateInfo.EC,
      DT: updateInfo.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const putRegisterProject = async (req, res) => {
  try {
    let registerInfo = await ProjectService.registerProject(
      req.body,
      req.params.id
    );
    return res.status(200).json({
      EM: registerInfo.EM,
      EC: registerInfo.EC,
      DT: registerInfo.DT,
    });
  } catch (error) {
    console.log(">> check error", error);
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const putUnregisterProject = async (req, res) => {
  try {
    const unregisterInfo = await ProjectService.unregisterProject(
      req.query.studentId,
      req.query.projectId
    );
    return res.status(200).json({
      EM: unregisterInfo.EM,
      EC: unregisterInfo.EC,
      DT: unregisterInfo.DT,
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

const getAllTime = async (req, res) => {
  try {
    let data = await ProjectService.getAllTime();
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

const postCreateTime = async (req, res) => {
  try {
    let timeData = await ProjectService.createTime(req.body);
    return res.status(200).json({
      EM: timeData.EM,
      EC: timeData.EC,
      DT: timeData.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const putUpdateTime = async (req, res) => {
  try {
    let timeData = await ProjectService.updateTime(req.body);
    return res.status(200).json({
      EM: timeData.EM,
      EC: timeData.EC,
      DT: timeData.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const handleDeleteTime = async (req, res) => {
  try {
    let deleteInfo = await ProjectService.deleteTime(req.body.id);
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

const putSetProjectTime = async (req, res) => {
  try {
    let timeData = await ProjectService.setProjectTime(req.body);
    return res.status(200).json({
      EM: timeData.EM,
      EC: timeData.EC,
      DT: timeData.DT,
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
  putUpdateProject,
  getProjectById,
  putRegisterProject,
  putUnregisterProject,
  getAllTime,
  postCreateTime,
  putUpdateTime,
  handleDeleteTime,
  putSetProjectTime,
};

import express from "express";
import projectController from "../controller/projectController";
import teacherController from "../controller/teacherController";
import announcementController from "../controller/announcementController";
const router = express.Router();

const initApiRoutes = (app) => {
  //project
  router.get("/project/read", projectController.getAllProjects);
  router.get("/project/readById", projectController.getProjectById);
  router.post("/project/create", projectController.postCreateProject);
  router.delete("/project/delete", projectController.handleDeleteProject);
  router.put("/project/update/:id", projectController.putUpdateProject);

  //teacher
  router.get("/teacher/read", teacherController.getAllTeacher);

  //announcement
  router.get("/announcement/read", announcementController.getAllAnnouncement);

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

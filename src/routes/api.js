import express from "express";
import projectController from "../controller/projectController";
import teacherController from "../controller/teacherController";
import announcementController from "../controller/announcementController";
const router = express.Router();

const initApiRoutes = (app) => {
  //project
  router.get("/project/read", projectController.getAllProjects);
  router.post("/project/create", projectController.postCreateProject);
  router.delete("/project/delete", projectController.handleDeleteProject);

  //teacher
  router.get("/teacher/read", teacherController.getAllTeacher);

  //announcement
  router.get("/announcement/read", announcementController.getAllAnnouncement);
  router.post(
    "/announcement/create",
    announcementController.postCreateAnnouncement
  );

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

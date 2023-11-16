import express from "express";
import projectController from "../controller/projectController";
import teacherController from "../controller/teacherController";

const router = express.Router();

const initApiRoutes = (app) => {
  //project
  router.get("/project/list", projectController.getAllProjects);
  router.post("/project/create", projectController.postCreateProject);

  //teacher
  router.get("/teacher/list", teacherController.getAllTeacher);

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

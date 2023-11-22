import express from "express";
import projectController from "../controller/projectController";
import teacherController from "../controller/teacherController";
import announcementController from "../controller/announcementController";
import scoreController from "../controller/scoreController";
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
  router.get(
    "/announcement/readById",
    announcementController.getAnnouncementById
  );
  router.post(
    "/announcement/create",
    announcementController.postCreateAnnouncement
  );
  router.put(
    "/announcement/update/:id",
    announcementController.putUpdateAnnouncement
  );
  router.delete(
    "/announcement/delete",
    announcementController.handleDeleteAnnouncement
  );

  //score
  router.get("/score/read", scoreController.getAllScore);
  router.get("/score/readById", scoreController.getScoreById);
  //router.post("/score/create", scoreController.postCreateScore);
  router.put("/score/update/:id", scoreController.putUpdateScore);
  //router.delete("/score/delete", scoreController.handleDeleteScore);

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

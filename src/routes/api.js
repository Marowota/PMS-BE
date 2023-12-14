import express from "express";
import projectController from "../controller/projectController";
import teacherController from "../controller/teacherController";
import announcementController from "../controller/announcementController";
import scoreController from "../controller/scoreController";
import authController from "../controller/authController";
import authenticationController from "../controller/authenticationController";
import analysisController from "../controller/analysisController";
import authorizationController from "../controller/authorizationController";
import accountController from "../controller/accountController";

const router = express.Router();

const initApiRoutes = (app) => {
  //--------------------------------------------------------------------------------------------------------------
  // authentication
  //router.post("/register", authController.register);
  router.post("/login", authenticationController.login);
  router.post("/token", authenticationController.getToken);
  router.delete("/logout", authenticationController.logout);
  //router.post("/posts", authController.authenticateToken, authController.post2);
  //router.post("/posts", authController.verifyToken, authController.posts);

  //--------------------------------------------------------------------------------------------------------------

  // authorization
  router.get("/role", authorizationController.getRole);

  //--------------------------------------------------------------------------------------------------------------

  // accoount

  router.get("/account/read", accountController.getAllAccount);
  router.post("/account/create", accountController.postCreateAccount);

  //--------------------------------------------------------------------------------------------------------------

  //project
  router.get("/project/read", projectController.getAllProjects);
  router.get("/project/readById", projectController.getProjectById);
  router.post("/project/create", projectController.postCreateProject);
  router.delete("/project/delete", projectController.handleDeleteProject);
  router.put("/project/update/:id", projectController.putUpdateProject);
  router.put("/project/register/:id", projectController.putRegisterProject);

  //--------------------------------------------------------------------------------------------------------------

  //teacher
  router.get("/teacher/read", teacherController.getAllTeacher);

  //--------------------------------------------------------------------------------------------------------------

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

  //--------------------------------------------------------------------------------------------------------------

  //score
  router.get("/score/read", scoreController.getAllScore);
  router.get("/score/readById", scoreController.getScoreById);
  //router.post("/score/create", scoreController.postCreateScore);
  router.put("/score/update/:id", scoreController.putUpdateScore);
  //router.delete("/score/delete", scoreController.handleDeleteScore);

  //--------------------------------------------------------------------------------------------------------------

  //analysis
  router.get(
    "/analysis/readStudentAndProject",
    analysisController.getProjectjAndStudent
  );
  router.get("/analysis/readMostProject", analysisController.getTheMostProject);
  router.get("/analysis/readMostStudent", analysisController.getTheMostStudent);
  router.get(
    "/analysis/readProjectStatus",
    analysisController.getProjectRegisterStatus
  );
  router.get(
    "/analysis/readMostRegisteredTeacher",
    analysisController.getTheMostRegisteredTeacher
  );
  router.get(
    "/analysis/readTeacherAverageScore",
    analysisController.getTeacherAverageScore
  );
  router.get(
    "/analysis/readHighestAverageScore",
    analysisController.getHighestAverageScore
  );

  //--------------------------------------------------------------------------------------------------------------

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

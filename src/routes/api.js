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
import userController from "../controller/userController";
import classInfoControler from "../controller/classInfoController";
import studentController from "../controller/studentController";

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

  // classInfo
  router.get("/classInfo/read", classInfoControler.getAllClass);
  router.post("/classInfo/create", classInfoControler.postNewClass);
  router.delete("/classInfo/delete", classInfoControler.handleDeleteClass);

  //--------------------------------------------------------------------------------------------------------------

  // account

  router.get("/account/read", accountController.getAllAccount);
  router.get("/account/readById/", accountController.getAccountById);
  router.post("/account/create", accountController.postCreateAccount);
  router.put("/account/update/:id", accountController.putUpdateAccount);
  router.delete("/account/delete", accountController.handleDeleteAccount);

  //--------------------------------------------------------------------------------------------------------------

  //project
  router.get("/project/read", projectController.getAllProjects);
  router.get("/project/readById", projectController.getProjectById);
  router.post("/project/create", projectController.postCreateProject);
  router.delete("/project/delete", projectController.handleDeleteProject);
  router.put("/project/update/:id", projectController.putUpdateProject);
  router.put("/project/register/:id", projectController.putRegisterProject);
  router.put("/project/unregister", projectController.putUnregisterProject);
  router.get("/project/read-time", projectController.getAllTime);
  router.post("/project/create-time", projectController.postCreateTime);
  router.put("/project/update-time/:id", projectController.putUpdateTime);
  router.delete("/project/delete-time", projectController.handleDeleteTime);
  router.put("/project/set-project-time", projectController.putSetProjectTime);

  //--------------------------------------------------------------------------------------------------------------

  //teacher
  router.get("/teacher/read", teacherController.getAllTeacher);
  router.get(
    "/teacher/readAnalysisData",
    teacherController.getAnalysisDataOfTeacher
  );

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
  router.put(
    "/score/updateSubmitLink/:id",
    scoreController.putUpdateSubmitLink
  );
  //router.delete("/score/delete", scoreController.handleDeleteScore);

  //--------------------------------------------------------------------------------------------------------------

  //analysis
  router.get("/analysis/readStudent", analysisController.getStudentsByTeacher);
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
  //user
  router.get("/user/readById", userController.getUserById);
  router.put("/user/update/:id", userController.putUpdateUser);

  //--------------------------------------------------------------------------------------------------------------
  //student
  router.get(
    "/student/readProjectOfStudent",
    studentController.getStudentProject
  );

  //--------------------------------------------------------------------------------------------------------------

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

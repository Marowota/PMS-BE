const express = require("express");
const apiController = require("../controller/apiController");
const router = express.Router();

const initApiRoutes = (app) => {
  router.get("/", (req, res) => {
    apiController.testAA();
    res.send("Birds home page");
  });
  router.get("/about", (req, res) => {
    res.send("About birds");
  });

  router.get("/project/list", apiController.getAllProjects);

  return app.use("/api/v1", router);
};

module.exports = initApiRoutes;

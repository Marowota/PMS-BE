const express = require("express");
const homeController = require("../controller/homeController");
const router = express.Router();

router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
router.get("/", (req, res) => {
  homeController.testAA();
  res.send("Birds home page");
});
router.get("/about", (req, res) => {
  res.send("About birds");
});

module.exports = router;

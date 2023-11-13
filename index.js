const express = require("express");
require("dotenv").config();
const web = require("./src/routes/web");
const app = express();
const port = process.env.PORT;

app.use("/", web);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
require("dotenv").config();
const initApiRoutes = require("./src/routes/api");
const configCors = require("./src/config/cors");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;

//config CORS
configCors(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
initApiRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

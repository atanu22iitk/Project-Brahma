const { config } = require("dotenv");
const express = require("express");
const app = express();
const mongoDbConnection = require("./src/config/db_connection.js");
const handleError = require("./src/middlewares/errorHandler");
const router = require("./src/app");

config("dotenv");

const PORT = process.env.PORT || 4000;
mongoDbConnection();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "this is index page" });
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`application listening on port http://localhost:${PORT}`);
});

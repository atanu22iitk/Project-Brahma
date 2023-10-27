const { config } = require("dotenv");
const express = require("express");
const app = express();
const {mongoDbConnection} = require("./src/config/db_connection.js");
const {ErrorResponse} = require("./src/Middlewares/errorHandler.js");
const router = require("./src/app");

config("dotenv");

const PORT = process.env.PORT || 8000;
mongoDbConnection();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "this is index page" });
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  ErrorResponse.handleError(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Auth server listening on port http://localhost:${PORT}`);
});

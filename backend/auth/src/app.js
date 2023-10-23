const express = require("express");
const app = express();
const DoctorRouter = require("./Doctor/Routes");

app.use("/doctor", DoctorRouter);

module.exports = app;

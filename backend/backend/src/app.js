const express = require("express");
const app = express();
const UserRouter = require("./User/Routes");
const DoctorRouter = require("./Doctor/Routes");

app.use("/user", UserRouter);
app.use("/doctor", DoctorRouter);

module.exports = app;

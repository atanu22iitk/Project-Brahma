const express = require('express');
const app = express();
const DoctorRoutes = require("./Doctor/Routes")

app.use('/doctor', DoctorRoutes);

module.exports = app;
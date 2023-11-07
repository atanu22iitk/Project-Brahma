const express = require('express');
const app = express();
const UserRoutes = require("./User/Routes")

app.use('/user', UserRoutes);

module.exports = app;
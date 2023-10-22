const { config } = require('dotenv');
const express = require('express');
const app = express();
const mongoDbConnection = require('./src/config/db_connection.js');
const handleError = require('./src/middlewares/errorHandler')

config('dotenv')

const PORT = process.env.PORT || 4000;
mongoDbConnection()

app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: "this is index page"});
})

app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
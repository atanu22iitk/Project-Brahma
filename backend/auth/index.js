const { config } = require('dotenv');
const express = require('express');
const app = express();
const handleError = require('./src/middlewares/errorHandler')
const mongoDbConnection = require('./src/config/db_connection.js')

config('dotenv')

const PORT = process.env.PORT || 4000;
mongoDbConnection()

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
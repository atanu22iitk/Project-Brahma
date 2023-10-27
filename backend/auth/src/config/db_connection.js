require('dotenv').config();
const mongoose = require('mongoose')
const {ErrorResponse} = require('../Middlewares/errorHandler');
const MONGODB_BACKEND_DB_URL = process.env.MONGODB_BACKEND_DB_URL


const mongoDbConnection = () => {
    try {
        const dbConnectionWithBackend = mongoose.connect(MONGODB_BACKEND_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        })   
        if (!dbConnectionWithBackend) throw new ErrorResponse('Error connecting with the backend and auth database', 500);
        console.log('Connected to backend and auth database');
        return {dbConnectionWithBackend}
    }
    catch(err) {
        console.log(err)
    }
}

module.exports = {mongoDbConnection}

const mongoose = require('mongoose')
const ErrorResponse = require('../utils/error')

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

const mongoDbConnection = () => {
    try {
        const dbConnection = mongoose.connect(process.env.MONGODB_URL,connectionParams)
        console.log('Connected to database ')
        if (!dbConnection) {
            throw new ErrorResponse(500, 'Error connecting with the database');
        }
    }
    catch(err) {
        next(err)
    }
}

module.exports = mongoDbConnection
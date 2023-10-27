const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_type: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


const UserModel = mongoose.model('doctor', userSchema);
module.exports = UserModel;
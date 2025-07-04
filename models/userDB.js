const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true,
    },
    designation: {
        type:String,
        required: true,
    },
    department: {
        type:String,
        required: true,
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    imageUrl: {
        type:String,
        required: true,
    },
})

const UserDB = mongoose.model('UserDB', userSchema)

module.exports = UserDB
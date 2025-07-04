const mongoose = require('mongoose')
const { type } = require('os')

const formSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    linkedUrl: {
        type: String,
        unique: true,
        required: true,
    },
},{timestamps:true})

const FormDB = mongoose.model('FormDB',formSchema)

module.exports = FormDB
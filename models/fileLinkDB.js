const mongoose = require('mongoose')

const fileLinkDBSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    }
})

const fileLinkDB = mongoose.model('fileLinkDB', fileLinkDBSchema)

module.exports = fileLinkDB
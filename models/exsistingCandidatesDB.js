const mongoose = require('mongoose')
const { type } = require('os')

const exsistingCandidatesSchema = new mongoose.Schema({
    profile_pic_url: {
        type: String,
    },

    fullName: {
        type: String,
        required: true,
    },

    position: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    summaryDetailed: {
        type: Object,
        required: true
    }

})

const exsistingCandidatesDB = mongoose.model('exsistingCandidatesDB', exsistingCandidatesSchema)

module.exports = exsistingCandidatesDB
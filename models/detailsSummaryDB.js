const mongoose = require('mongoose')
const { type } = require('os')

const detailsSummarySchema = new mongoose.Schema({
    profile_pic_url: {
        type: String,
    },
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
        required: true,
    },
    linkedUrl: {
        type: String,
        required: true,
    },
    summaryDetailed: {
        type: Object,
        required: true
    }

})

const detailsSummaryDB = mongoose.model('detailsSummaryDB', detailsSummarySchema)

module.exports = detailsSummaryDB
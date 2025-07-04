const mongoose = require('mongoose')
const { type } = require('os')

const candidateDB = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    profile_pic_url: {
        type: String,
    },
    occupation: {
        type: String,
    },
    recommendations: {
        type: Array,
    },
    skills_endorsements: {
        type: Object,
    },
    summary: {
        type: String,
    },
    experiences: {
        type: Array,
    },
    education: {
        type: Array,
    },
    certifications: {
        type: Array,
    },
    accomplishment_projects: {
        type: Array,
    },
    volunteer_work:{
        type: Array,
    },
    accomplishment_publications: {
        type: Array,
    },	
    accomplishment_honors_awards: {
        type: Array,
    },
    accomplishment_test_scores: {
        type: Array
    },	
})

const CandidateDB = mongoose.model('CandidateDB',candidateDB)

module.exports = CandidateDB
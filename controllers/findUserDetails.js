const exsistingCandidatesDB = require("../models/exsistingCandidatesDB")
const detailsSummaryDB = require("../models/detailsSummaryDB")

async function findUserDetails(fullName) {
    try {
        const user = await exsistingCandidatesDB.findOne({ fullName })
        if (user) {
            const email = user.email
            const user_final = await detailsSummaryDB.findOne({email})
            return user_final
        }
        else {
            return "No user data found"
        }
    } catch (error) {
        console.log("not success of finding user")
        return "fail"
    }
}

module.exports = {findUserDetails}
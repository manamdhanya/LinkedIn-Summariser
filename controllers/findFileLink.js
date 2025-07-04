const fileLinkDB = require("../models/fileLinkDB")

async function findFileLink(email) {

    try {

        const user = await fileLinkDB.findOne({ email })
        if (user) {
            return user
        }
        else {
            return "User not found"
        }

    } catch (error) {
        console.log("Find file Link not successful of finding user")
        return "fail"
    }

}

module.exports = {findFileLink}
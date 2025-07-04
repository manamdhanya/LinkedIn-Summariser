const User = require('../models/userDB')
const { setUser, getUser } = require('../service/auth')
const FormDB = require('../models/formDB')
const { DataRetriver } = require('../controllers/DataRetriving')
const { geminiModel } = require('../controllers/summary')

async function handleFormData(req, res) {
    try {
        const { firstName, lastName, phoneNumber, position, email, linkedUrl } = req.body
        await FormDB.create({ firstName, lastName, phoneNumber, position, email, linkedUrl })

        const output = await DataRetriver(linkedUrl)

        const token = req.cookies?.uid
        if (!token) {
            return res.status(401).redirect("/Login")
        }

        const user = getUser(token);
        if (!user) {
            return res.status(401).redirect("/Login")
        }


        const email_user = user.email
        const name_user = user.name
        const imageUrl_user = user.imageUrl

        if (output[0] === "success") {
            const userDetails = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                position: position,
                email: email,
                linkedUrl: linkedUrl,
            }
            const summary = await geminiModel(output[1], userDetails)
            const profile_pic_url = output[1].profile_pic_url


            return res.status(200).render('Summary', { profile_pic_url, summary, name_user, email_user, imageUrl_user})
        }

        const firstName_resume = firstName
        const lastName_resume = lastName
        const email_resume = email
        const phoneNumber_resume = phoneNumber
        const linkedUrl_resume = linkedUrl


        await FormDB.deleteOne({ linkedUrl: linkedUrl })
        return res.status(400).render("AddCandidate", { error: output[0], name_user, email_user, imageUrl_user,  firstName_resume, phoneNumber_resume, lastName_resume, email_resume, linkedUrl_resume })
    } catch (error) {
        console.log(error.errmsg)
        const output = "Already Data is present"
        const token = req.cookies?.uid
        if (!token) {
            return res.status(401).redirect("/Login");
        }

        const user = getUser(token);
        if (!user) {
            return res.status(401).redirect("/Login");
        }


        const email_user = user.email
        const name_user = user.name
        const imageUrl_user = user.imageUrl
        const firstName_resume = req.body.firstName;
        const lastName_resume = req.body.lastName;
        const phoneNumber_resume = req.body.phoneNumber;
        const position_resume = req.body.position;
        const email_resume = req.body.email;
        const linkedUrl_resume = req.body.linkedUrl;

        return res.status(500).render("AddCandidate", { error: output, name_user, email_user, imageUrl_user, firstName_resume, lastName_resume, phoneNumber_resume, position_resume, email_resume, linkedUrl_resume})
    }
}

module.exports = { handleFormData }


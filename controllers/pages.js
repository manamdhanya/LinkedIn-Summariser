const User = require('../models/userDB')
const exsistingCandidatesDB = require("../models/exsistingCandidatesDB")
const { setUser, getUser } = require('../service/auth')
const { findAllCustomers } = require('../controllers/FindAllCandidates')
const { findUserDetails } = require("../controllers/findUserDetails")
const { parsefile } = require("../controllers/fileUploading")
const { extractCandidateDetails } = require("../controllers/geminiextract")
const {findFileLink} = require("../controllers/findFileLink")
const fileLinkDB  =  require("../models/fileLinkDB")

async function handleLogin(req, res) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email, password })

        if (!user) {
            return res.status(401).render("Login", { error: "Wrong email or password!" })
        }

        const token = setUser(user)

        res.cookie("uid", token)


        return res.redirect('/Homepage')
    } catch (error) {
        console.log("Login error:", error)
        return res.status(500).render("Login", { error: "Login failed. Please try again later." })

    }
}

async function loginPage(req, res) {
    const token = req.cookies?.uid
    const user = getUser(token);
    if (user) {
        return res.redirect("/HomePage")
    }

    return res.render('Login')
}

async function homePage(req, res) {
    const token = req.cookies?.uid
    if (!token) {
        return res.status(401).redirect("/Login")
    }

    const user = getUser(token);
    if (!user) {
        return res.status(401).redirect("/Login")
    }

    const result = await findAllCustomers()


    const email_user = user.email
    const name_user = user.name
    const imageUrl_user = user.imageUrl

    res.render('HomePage', { name_user, email_user, imageUrl_user, result: result })
}

async function handleSignOut(req, res) {
    res.clearCookie("uid")
    res.redirect("/")
}

async function addCandidate(req, res) {

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

    res.render('Upload', { name_user, email_user, imageUrl_user })
}

async function summary(req, res) {
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

    res.render('Upload', { name_user, email_user, imageUrl_user })
}

async function viewProfilequery(req, res) {
    const fullName = req.params.user

    const result = await findUserDetails(fullName)


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
    const profile_pic_url = result.profile_pic_url
    const firstName = result.firstName
    const lastName = result.lastName
    const phoneNumber = result.phoneNumber
    const email = result.email
    const position = result.position
    const url = result.linkedUrl
    const summaryDetailed = result.summaryDetailed

    const user_file_found = await findFileLink(email)

    const file_URL = user_file_found.fileUrl

    res.render('ViewProfile', { profile_pic_url, firstName, lastName, phoneNumber, email, position, url, summaryDetailed, email_user, name_user, imageUrl_user, file_URL })
}

async function profile(req, res) {
    const token = req.cookies?.uid

    if (!token) {
        return res.status(401).redirect('/')
    }

    const user = getUser(token)

    if (!user) {
        return res.status(401).redirect("/")
    }

    const FirstName = user.FirstName
    const LastName = user.LastName
    const email = user.email
    const designation = user.designation
    const department = user.department
    const imageUrl = user.imageUrl

    res.render('Profile', { FirstName, LastName, email, designation, department, imageUrl })
}

async function searchHomePage(req, res) {

    const fullNameSearch = req.params.value
    let result = []
    const token = req.cookies?.uid
    if (!token) {
        return res.status(401).redirect("/Login")
    }

    const user = getUser(token);
    if (!user) {
        return res.status(401).redirect("/Login")
    }

    const values = await exsistingCandidatesDB.find({ fullName: { $regex: `${fullNameSearch}`, $options: "i" } })

    result = values

    if (result.length == 0) {
        const values = await findAllCustomers()
        console.log(values)
        result = values
    }

    const email_user = user.email
    const name_user = user.name
    const imageUrl_user = user.imageUrl

    res.render('HomePage', { name_user, email_user, imageUrl_user, result: result })
}

async function upload(req, res) {
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

    res.render('Upload', { name_user, email_user, imageUrl_user })
}

async function UploadFile(req, res) {
    try {
        
        const { fields, files } = await parsefile(req)
        const fileUrl = files.file[0].uploaded.Location

        const details = await extractCandidateDetails(fileUrl)

        const firstName_resume = details.firstName
        const lastName_resume = details.lastName
        const email_resume = details.email
        const phoneNumber_resume = details.phoneNumber
        const linkedUrl_resume = details.linkedUrl

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

        const email = email_resume

        await fileLinkDB.create({email,fileUrl})
        
        res.render('AddCandidate', {
            success: true,
            message: 'Details extracted successfully!',
            name_user, email_user, imageUrl_user,
            firstName_resume, phoneNumber_resume, lastName_resume, email_resume, linkedUrl_resume,
        })

    } catch (err) {
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
        
        res.render('Upload', {
            error: true,
            message: 'Upload failed: ' + err.message,
            name_user, email_user, imageUrl_user,
        })
    }
}

module.exports = { loginPage, homePage, handleLogin, handleSignOut, addCandidate, summary, profile, viewProfilequery, searchHomePage, upload, UploadFile }
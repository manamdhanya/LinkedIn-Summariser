require('dotenv').config()
const jwt = require('jsonwebtoken')
const secret = process.env.jwt_secret_key

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        department: user.department,
        FirstName: user.FirstName,
        LastName: user.LastName,
        imageUrl: user.imageUrl,
    },secret)
}

function getUser(token) {
    if (!token) return null
    return jwt.verify(token, secret)
}

module.exports = {setUser,getUser}
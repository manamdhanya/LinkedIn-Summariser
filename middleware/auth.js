const {getUser} = require('../service/auth')

async function restrictTologgedUser(req,res,next){
    const userUid = req.cookies?.uid;

    if(!userUid) {
        return res.status(401).render('Login')
    }

    const user = getUser(userUid)

    if(!user) {
        return res.status(401).render('Login')
    }

    req.user = user
    next()
}

module.exports = {restrictTologgedUser}
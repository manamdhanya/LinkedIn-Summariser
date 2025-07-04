const express = require('express')
const {loginPage,homePage,handleLogin,handleSignOut,addCandidate,summary,profile, 
    viewProfilequery,searchHomePage,upload, UploadFile} = require('../controllers/pages')
const {restrictTologgedUser} = require('../middleware/auth')
const {handleFormData} = require('../controllers/FormData')

const router = express.Router()

router.get('/',loginPage)

router.get('/Login',handleSignOut)

router.post('/Login',handleLogin)

router.get('/HomePage',restrictTologgedUser, homePage)

router.get('/HomePage/:value',restrictTologgedUser, searchHomePage)

router.get('/Upload',restrictTologgedUser,upload)

router.post('/AddCandidate',restrictTologgedUser,UploadFile)

router.get('/AddCandidate',restrictTologgedUser,addCandidate)

router.get('/ViewProfile/:user',restrictTologgedUser,viewProfilequery)

router.get('/Summary',restrictTologgedUser,summary)

router.post('/Summary',restrictTologgedUser,handleFormData)

router.get('/Profile',restrictTologgedUser,profile)


module.exports = router
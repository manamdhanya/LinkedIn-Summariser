const express = require('express')
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/routes')
const {connect} = require('./connect')

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Database Connected")

    
})
.catch(()=>{
    console.log("Error in connecting")
})

app.set('view engine','ejs')

app.use("/",userRoute)

app.listen(5001,()=>{
    console.log('server is listening...')
})
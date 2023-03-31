require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')

// Routes
const authRoute = require('./routes/auth')
const postRouter = require("./routes/posts")
const usersRouter = require('./routes/users')
const viewsRouter = require('./routes/views')
const multer = require('multer')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use(express.json())

//setting up session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))

//setting up flash messages
app.use(flash())

app.use((req, res, next) => {
    res.locals.errorMsg = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
})


// passport setup
 app.use(passport.initialize())

 app.use(passport.session())


//connecting to database
mongo.connect(process.env.MONGO)
.then(()=>{
    console.log("[+] Database connected!")
})
.catch((e)=>{
    console.log("[!] Failed to connect!", e.message)
})

app.use("/", authRoute)
app.use("/", postRouter)
app.use("/", usersRouter)
app.use("/", viewsRouter)
app.listen(4444, () => {
    console.log(`Port connected on: ${process.env.BASE_URL}`)
})
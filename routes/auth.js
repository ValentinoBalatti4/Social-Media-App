const router = require('express').Router()
const passport = require('passport')

const User = require('../models/Users')


passport.use(User.createStrategy())

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user)
    })
})

//register user in DB
router.post("/auth/sign-up", async (req, res) =>{

    try{
        const newUser = await User.register({username: req.body.username, email: req.body.email }, req.body.password)
        
        if(newUser){
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home")
            })
        } else{
            res.redirect("/")
        }       
         
    }catch(err){
        console.log(err)
    }
})


//login user
router.post("/auth/login", (req, res)=>{
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    //check if credentials are correct
    req.login(user, (err)=>{
        if(err){
           res.send(err)
        }
        else{
            passport.authenticate("local", {
                failureRedirect: "/",
                successRedirect:"/home",
                failureMessage: "User or Password is invalid!",
            })(req, res)
        }
    })
})

//logout user
router.get("/auth/logout", (req, res) =>{
    req.logOut((err) =>{
        if(err){
            console.log(err)
        }
    })
    
    res.redirect("/")
})

module.exports = router
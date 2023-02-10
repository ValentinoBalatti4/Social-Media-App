const router = require('express').Router()
const { Router } = require('express')
const Post = require('../models/Posts')
const User = require('../models/Users')


router.get('/', (req, res) => {

    if(req.isAuthenticated()){
        res.redirect('/home')
    }else{
        res.render('login')
    }
})

router.get("/home", async (req, res)=>{
    
    const currentUser = await User.findById(req.user._id)

    try{
        //fetch all Posts and Users from DB
        const allPosts = await Post.find()
        const users = await User.find()

        res.render("home", {allPosts, isAuth: req.isAuthenticated(), currentUser, users})
    } catch(err){
        res.send(err, "Error!!!")
    }
})

router.get('/myprofile', async (req, res) => {
    
    
    try{
        const users = await User.find()


        const currentUser = await User.findById(req.user._id)
        const usersPosts = await Post.find({username: req.user.username})


        res.render("myProfile", {usersPosts, currentUser, users})
    } catch(err){
        res.send(err)
    }
})


module.exports = router
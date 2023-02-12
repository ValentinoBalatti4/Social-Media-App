const Posts = require('../models/Posts')
const User = require('../models/Users')
const router = require('express').Router()
const fs = require('fs')
const multer = require("multer")
const upload = multer({dest: "public/profPics/"})

//delete user

router.delete("/home/delete/:id", async (req, res) => {
    if(req.body.userId === req.params.id){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch (err){
            return res.status(500).json(err)
        }
    } else{
        res.status(403).json("You can only delete your own account!")
    }
})

//fetch a user

router.get("/search", async (req, res) =>{
    try{    
        const users = await User.find()


        const currentUser = await User.findById(req.user._id)
        const user = await User.findOne({username: req.query.search})        

        if(user !== null){
            const usersPosts = await Posts.find({username: req.query.search})

            res.status(200)
            res.render("search", {usersPosts, user, currentUser, users})
        } else{
            res.status(404)
            res.redirect("/home?error=" + encodeURIComponent("The user you are looking for doesnt exist!"))
        }


    } catch(err){
        res.status(500).json(err)    
    }  
})  

//change profile pic
router.post("/myprofile/changepic", upload.single("image"), async (req, res) => {
    try{
        const currentUser = await User.findById(req.user._id)
        const newImg = req.file.path

        if(currentUser.profilePic !== ""){
            const profilePic = currentUser.profilePic
            fs.unlink("./public" + profilePic, (err) => {
                if(err){
                    console.log(err)
                }
            })
        }

        await currentUser.updateOne({ $set: { profilePic: newImg.replace("public", "") } })
        
        var backURL=req.header('Referer') || '/'
        res.redirect(backURL)

    } catch(err){
        res.send(err)
    }
})



// Follow/Unfollow
router.post("/home/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.user._id)
            if(!user.followers.some(follower => follower === req.user.username)){
                await user.updateOne({ $push: {followers:  req.user.username} })
                await currentUser.updateOne({ $push: {following: user.username} })
                res.status(200)
            
            } else{
                await user.updateOne({ $pull: {followers: req.user.username} })
                await currentUser.updateOne({ $pull: { following: user.username} })
                res.status(200)
            }

            var backURL=req.header('Referer') || '/'
            res.redirect(backURL)

        } catch (err){
            res.send(err)
        }
    }
})

module.exports = router
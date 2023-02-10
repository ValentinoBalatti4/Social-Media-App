const router = require('express').Router()
const Post = require('../models/Posts')
const User = require('../models/Users')
const fs = require('fs')
const { randomUUID } = require('crypto')
const multer = require('multer')
const upload = multer({dest: "public/uploads/"})

const getAuthentication = (req, res) =>{

    if(!req.isAuthenticated()){
        res.status(404).json()
    } 
    
}

const goBack = (req, res) => {
    var backURL=req.header('Referer') || '/'
    res.redirect(backURL)
}

router.post('/submit', upload.single("image"), async (req, res) => {
    try {
        getAuthentication(req, res);
        
        let imgCuredPath = ""
        if(req.file){
            let imgPath = req.file.path
            imgCuredPath = imgPath.replace("public", '')
        }

        const post = new Post({
            username: req.user.username,
            text: req.body.text,
            userPicPath: req.user.profilePic, 
            imgPath: imgCuredPath
        });
  
        await post.save();
        res.redirect("/home");
    } catch (err) {
        res.send("Error: " + err);
    }
});
  
router.post("/like/:id", async (req, res) => {
    try {
        
        const post = await Post.findById(req.params.id)
    
        if (!post.likes.includes(req.user.username)) {
            await post.updateOne({ $push: { likes: req.user.username } })
            res.status(200)
        } else {
            await post.updateOne({ $pull: { likes: req.user.username } })
            res.status(200)
        }

        goBack(req, res)
    
    } catch (err) {
        res.json(err)
    }
})

router.post("/comment/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)

        var comment = req.body.comment

        if(comment !== ""){
            await post.updateOne({ $push: { comments: {
                id: randomUUID(),
                comment: comment,
                username: req.user.username,
                profilePic: req.user.profilePic
            }}})
        }

        goBack(req, res)

    } catch(err){
        res.json(err)
    }
})

router.post("/removeComment/:postId/:commentId", async (req, res) => {
    try{

        await Post.findOneAndUpdate(
            {'_id': req.params.postId},
            { $pull: {comments: {id: req.params.commentId} } },
        )

        goBack(req, res)

    } catch (err){
        res.send("Error: " + err)
    }
})

//delete post
router.post("/delete/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.imgPath !== ""){
            const imgPath = post.imgPath
            fs.unlink("./public" + imgPath, (err) => {
                if(err){
                    console.log(err)
                }
            })
        }


        await post.deleteOne()
        res.status(200)

        goBack(req, res)

    } catch(err){
        res.sendStatus(500).json(err)
    }
})


module.exports = router
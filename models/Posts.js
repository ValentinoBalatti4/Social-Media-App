const mongo = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const Post = new mongo.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    text: {
        type:String,
        max: 500
    },
    imgPath: {
        type: String,
        default: ""
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
}, {timestamps: true})

Post.plugin(passportLocalMongoose)

module.exports = mongo.model("Post", Post)
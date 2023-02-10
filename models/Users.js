const mongo = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const User = new mongo.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        max:50
    },
    password: {
        type: String,
        min: 6
    },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    }
}, {timestamps: true})  

User.plugin(passportLocalMongoose)

module.exports = mongo.model("User", User)
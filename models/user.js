const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//passport local mongoose automatically add username and password into database
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.jpeg'
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
});

// in order to use passport local mongoose, we have to plugin to it
userSchema.plugin(passportLocalMongoose);

// create user
const User = mongoose.model('User', userSchema);

module.exports = User;
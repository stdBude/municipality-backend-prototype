const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role:{
        type: String,
        required: true,
        trim: true,
        enum: ["admin", "user"],
        default: "user"
    }
})

module.exports = mongoose.model("User", UserSchema);
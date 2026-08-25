const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageRef:{
        type: String,
        required: true,
    }
    ,
    public_idOfImage: {
            type: String,
            required: true
        },
    title:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    region:{
        type: String,
        required: true,
        trim: true,
        maxlength: 15
    },
    typeOfRequest:{
        type: String,
        required: true,
        trim: true,
        enum: ["Road Crack", "Electricity", "Water Supply", "Garbage Collection", "other"]
    }

},{
    timestamps: true
})

module.exports = mongoose.model("Request", requestSchema);
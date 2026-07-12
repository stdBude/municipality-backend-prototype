const Request = require("../model/request");
const { uploadImage, deleteImage } = require("../helper/cloudinaryHelper");
const fs = require('fs');

const getAllRequests = async (req, res) => {
    try{
        const requests = await Request.find();
        res.status(200).json({message: "Requests fetched successfully", requests});
    }catch(e){
        res.status(500).json({message: e.message});
    }
}

const getRequestById = async (req, res) => {
    try{
        const request = await Request.findById(req.params.id);
        if(!request){
            return res.status(404).json({message: "Request not found"});
        }
        res.status(200).json({message: "Request fetched successfully", request});
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
const getRequestByUser = async (req, res) => {
    try{
        const request = await Request.find({ user: req.params.id });
        if(!request){
            return res.status(404).json({message: "Request not found"});
        }
        res.status(200).json({message: "Request fetched successfully", request});
    }catch(e){
        res.status(500).json({message: e.message, errorType: e.name,
            errorCode: e.code,
            errorKind: e.kind});
    }
}


const createRequest = async (req, res) => {
    try{
        const file = req.file.path;
    const data = req.body;
    const { public_id, secure_url } = await uploadImage(file);
        const request = new Request({
                user:data.user,
                imageRef:secure_url,
                public_idOfImage: public_id,
                title:data.title,
                description: data.description,
                region: data.region,
                typeOfRequest: data.typeOfRequest
        });
        await request.save();
        fs.unlinkSync(file);
        res.status(201).json({message: "Request created successfully", request});
    }catch(e){
        res.status(400).json({
            message: e.message,
            errorType: e.name,
            errorCode: e.code,
            errorKind: e.kind
        });
    }
}

const deleteRequest = async (req, res) => {
    try{
        const request = await Request.findByIdAndDelete(req.params.id);
        if(!request){
            return res.status(404).json({message: "Request not found"});
        }
        if(request.public_idOfImage){
            await deleteImage(request.public_idOfImage);
        }
        res.status(200).json({message: "Request deleted successfully", request});
    }catch(e){
        res.status(500).json({message: e.message});
    }
}

module.exports = { getAllRequests, getRequestById, createRequest, deleteRequest, getRequestByUser };
const Request = require("../model/request.js");
const User = require("../model/user.js");
const mongoose =require("mongoose")
const { uploadImage, deleteImage } = require("../helper/cloudinaryHelper");
const fs = require('fs');

const getAllRequests = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 5
        const page = parseInt(req.query.page) || 1
        const filterType = req.query.type
        const filterRegion = req.query.region
        const skip = (page - 1) * limit
       const matchStage = {}
        if (filterType) {
            matchStage.typeOfRequest = filterType
        }
        if (filterRegion) {
            matchStage.region = filterRegion
        }

        const requests = await Request.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ])
        res.status(200).json({message: "Requests fetched successfully", requests});
    }catch(e){
        res.status(500).json({message: e.message});
    }
}

const getRequestById = async (req, res) => {
    try{
        const request = await Request.findById(req.params.id).lean();
        
        if(!request){
            return res.status(404).json({message: "Request not found"});
        }
        const user = await User.findById(request.user)
        res.status(200).json({message: "Request fetched successfully", request, user});
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
const getRequestByUser = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 5
        const page = parseInt(req.query.page) || 1
        const filterType = req.query.type
        const filterRegion = req.query.region
        const skip = (page - 1) * 5
        const userId = req.params.id

        const request = await Request.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $addFields: {
                    score: {
                        $add: [
                            { $cond: [{ $eq: ["$typeOfRequest", filterType || null] }, 2, 0] },
                            { $cond: [{ $eq: ["$region", filterRegion || null] }, 1, 0] }
                        ]
                    }
                }
            },
            { $sort: { score: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ])
        const user = await User.findById(userId)
        if(!request){
            return res.status(404).json({message: "Request not found"});
        }
        res.status(200).json({message: "Request fetched successfully", request, user});
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

const requestsCounts = async (req, res) =>{
    try{
        const request = await Request.find({}).lean()
        const areas = request
        const uniqueCount = new Set(
        areas.map(v => v.region.trim())
        ).size;
         const filterType = req.query.type
        const filterRegion = req.query.region
        
        const matchStage = {}
        if (filterType) {
            matchStage.typeOfRequest = filterType
        }
        if (filterRegion) {
            matchStage.region = filterRegion
        }

        res.json({
            success: true,
            theWhole: request.length,
            other: request.filter(item => item.typeOfRequest === "other").length,
            electricity: request.filter(item => item.typeOfRequest === "Electricity").length,
            roadCrack: request.filter(item => item.typeOfRequest === "Road Crack").length,
            waterSupply: request.filter(item => item.typeOfRequest === "Water Supply").length,
            garbageCollection: request.filter(item => item.typeOfRequest === "Garbage Collection").length,
            perArea: uniqueCount
        })
    }catch(e){
        res.status(500).json({
            success: false
            ,message: e.message});
    }
}

const requestsCountsFilter = async (req, res) =>{
    try{
        const filterType = req.query.type
        const filterRegion = req.query.region
        
        const matchStage = {}
        if (filterType) {
            matchStage.typeOfRequest = filterType
        }
        if (filterRegion) {
            matchStage.region = filterRegion
        }

        const request = await Request.countDocuments(matchStage)
        
        res.json({
            success: true,
            theWhole: request,
            
        })
    }catch(e){
        res.status(500).json({
            success: false
            ,message: e.message});
    }
}

const requestsFilterByType = async (req, res) =>{
    try{
        const filter = req.query.filter

        if(!filter){
            console.log("no filter");
            res.status(404).json({
                success: false,
                message: "no filteration"
            })
        }

        const request = await Request.find({typeOfRequest : filter})

        res.json({
            success: true,
            filterd: request
        })
    }catch(e){
        res.status(500).json({
            success: false
            ,message: e.message});
    }
}


module.exports = { getAllRequests, getRequestById, createRequest, deleteRequest, requestsCountsFilter, getRequestByUser, requestsCounts, requestsFilterByType };
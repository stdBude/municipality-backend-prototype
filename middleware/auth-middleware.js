const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authMiddleware = async (req, res, next) => {
    try{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if(!token){
            return res.status(401).json({message: "No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userInfo = decoded;
        next();
    }catch(err){
        return res.status(500).json({message: "Server error"});
    }
}

const role = async (req, res, next) => {
    try{
        const userRole = req.userInfo.role;
        if(userRole !== "admin"){
            return res.status(200).json({message: "Access denied", role: userRole, success: false});
        }

        next();
    }catch(err){
        return res.status(500).json({message: "Server error"});
    }
}
module.exports = { authMiddleware, role };
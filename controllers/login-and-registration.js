const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const addUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const userFind = await User.find({ $or: [{ username }, { email }] });
        
        if(userFind.length > 0){
            return res.status(400).json({message: "Username or email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        await newUser.save();
        res.status(201).json({message: "User created successfully", token});
    }catch(e){
        res.status(500).json({message: e.message});
    }
}

const addAdmin = async (req, res) => {
    try{
        
        const userFind = await User.find({ $or: [{ username: process.env.admin_username }, { email: process.env.admin_email }] });
        
        if(userFind.length > 0){
            return res.status(400).json({message: "Username or email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.admin_password, salt)

        const newUser = new User({
            username: process.env.admin_username,
            email: process.env.admin_email,
            password: hashedPassword,
            role: "admin"
        })

        await newUser.save();
        res.status(201).json({message: "User created successfully"} );
    }catch(e){
        res.status(500).json({message: e.message});
    }
}

const loginUser = async (req, res) => {
      try{
            const {username , password} = req.body;
            
    
            const existUser = await User.findOne({ username });
    
            if(!existUser){
                return res.status(404).json({message: "User not found", success: false});
            }
    
            const confirmPassword = await bcrypt.compare(password, existUser.password);
    
            if(!confirmPassword){
                return res.status(401).json({message: "Invalid password", success: false});
            }
    
            const token = jwt.sign({ username: existUser.username , role: existUser.role, id: existUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({message: "Login successful", token: token , user: existUser, success: true});
            
        }catch(err){
            return res.status(500).json({message: "Server error", success: false});
        }
}

module.exports = { addUser, loginUser, addAdmin };
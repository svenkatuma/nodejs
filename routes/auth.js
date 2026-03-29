import express from "express";
import bcrypt from "bcryptjs";
import Users from "../models/Users.js";

const authRouter = express.Router();

// POST http://localhost:3000/api/auth/signup
authRouter.post("/signup", (req, res)=>{
    // req.body
    var {username, password} = req.body;
    bcrypt.hash(password, 10).then(hashedPassword=>{
        var newUser = new Users(
                {
                    username,
                    password:hashedPassword
                }
            );
        newUser.save();
    }).then(()=>{
        return res.status(201).json({type:"success", message:"User Created!"});
    }).catch(error => {
            return res.status(500).json({type:"error", message:error.message});
    });
});

authRouter.post("/login", (req, res)=>{
    // req.body
    var {username, password} = req.body;
    Users.findOne({username}).then(user=>{
        if (!user) {
            return res.status(404).json({type:"error", message:"User not found!"});
        }
        return bcrypt.compare(password, user.password);
    }).then((isMatch)=>{
        console.log(isMatch);
        if (!isMatch) {
            return res.status(401).json({type:"error", message:"Invalid Password!"});
        }
        return res.status(200).json({type:"success", message:"Login successful!"});
    }).catch(error => {
            return res.status(500).json({type:"error", message:error.message});
    });
});

export default authRouter;
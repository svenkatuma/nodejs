import express from "express";
import bcrypt from "bcryptjs";
import Users from "../models/Users.js";

const authRouter = express.Router();

// POST http://localhost:3000/tasks
authRouter.post("/signup", async (req, res)=>{
    try {
        // req.body
        var {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        var newUser = new Users(
                {
                    username,
                    password:hashedPassword
                }
            );
            await newUser.save();
            res.status(201).json({type:"success", message:"User Created!"});
    } catch(error) {
            res.status(500).json({type:"error", message:error.message});
    }
});

export default authRouter;
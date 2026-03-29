import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";

var app = express();
const PORT = 3000;

// No one allowed if cors() not called in the middleware
// Only orgin 5173 allowed
// app.use(cors({origin:"http://localhost:5173"}));
// orgin 5173 & 5174 are allowed
// app.use(cors({origin:["http://localhost:5173","http://localhost:5174"]}));
// All are allowed
app.use(cors());
// app.use(cors({origin:"*"}));
app.use(express.json());

mongoose.connect("mongodb+srv://root:root@cluster0.wbiyhhu.mongodb.net/tododb").then((res)=>{
     if (res.STATES.connected === 1){
        console.log(`Connected to MongoDB ${res.connection.name}!`)
    } else {
        console.log("Error connecting MongoDB!")
    }
}).catch((error)=>{console.log(error)});

//Create Schema or Structure
var todoTaskSchema = mongoose.Schema({
    id:Number,
    taskName:String
})

//Create Model (Collection/Table)
var TodoTaskModel = mongoose.model("todotasks", todoTaskSchema)

// GET http://localhost:3000/tasks
app.get("/tasks", (req,res)=>{
    console.log("GET: Task")
    TodoTaskModel.find()
    .then((data)=>{
        console.log(data); 
        res.json(data)})
    .catch((error)=>{
        console.log(error);
        res.json({type:"error", message:error.message});
    });
})

// POST http://localhost:3000/tasks
app.post("/tasks", (req, res)=>{
    // req.body
    var taskData = req.body;
    if (!taskData.taskName) {
        res.json({type:"error", message:"Enter Task!"})
    } else {
      var newTask = new TodoTaskModel(
            {
                id: Date.now(),
                taskName:taskData.taskName
            }
        )
        newTask.save()
        .then((data)=>{
            res.json(data)
        })
        .catch((error)=>{
            console.log(error);
            res.json({type:"error", message:error.message});
        });
    }
})

// PUT http://localhost:3000/tasks/1
app.put("/tasks/:id", (req,res)=>{
    // req.params.id
    // req.body;
    TodoTaskModel.findOneAndUpdate({id:req.params.id},req.body,{new:true})
        .then((data)=>{
            res.json(data)
        })
        .catch((error)=>{
            console.log(error);
            res.json({type:"error", message:error.message});
        });
})

// DELETE http://localhost:3000/tasks/1
app.delete("/tasks/:id", (req, res)=>{
    TodoTaskModel.findOneAndDelete({id:req.params.id})
        .then((data)=>{
            console.log(data)
            res.json(data)
        })
        .catch((error)=>{
            console.log(error);
            res.json({type:"error", message:error.message});
        });
})

// /api/auth/singup
app.use("/api/auth", authRouter)
// app.use("/api/todo", todoRouter)

//listener
app.listen(PORT,()=>{
    // console.log("Server listening on port# "+PORT);
    console.log(`Server listening on port# ${PORT}`);
})

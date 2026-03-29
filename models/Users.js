import mongoose from "mongoose";

//Create Schema or Structure
var UserSchema = mongoose.Schema({
    username:{type:String, required:true,unique:true},
    password:{type:String, required:true}
})

//Create Model (Collection/Table)
var Users = mongoose.model("Users", UserSchema);

export default Users;
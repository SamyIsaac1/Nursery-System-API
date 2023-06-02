const mongoose=require('mongoose');
const schema = new mongoose.Schema({
    fullName:String,
    password:String,
    email:String,
    image:String,
    isAdmin:Boolean
});

mongoose.model("teachers",schema);
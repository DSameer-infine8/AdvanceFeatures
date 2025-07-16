const mongoose =  require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profilePic:{
        type:String
    },
});
userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User", userSchema);
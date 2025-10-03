import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const anilistSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},{ timestamps: true });



anilistSchema.methods.generateToken = async function (){
try {
    return jwt.sign({
        userID: this._id.toString(),
        email: this.email,
       
    },
    process.env.JWT_KEY,
    {
        expiresIn: "30d",
    }
)
} catch (error) { 
    console.log("error jwt", error);
}
}  

const Anilist = mongoose.model('anilist', anilistSchema);

module.exports = Anilist;




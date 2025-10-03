import mongoose from "mongoose";

const userAnimeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "anilist",
        required: true
    },
    animeId:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    poster:{
        type: String
    },
    status:{
        type: String,
        enum: ["watching","will-watch","watched"],
        default: "will-watch"
    },
    score:{
        type: Number,
        min: 0,
        max: 10
    }
},{timestamps: true});

module.exports = mongoose.model("UserAnime",userAnimeSchema);
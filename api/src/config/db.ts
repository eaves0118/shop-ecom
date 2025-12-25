import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import {ENV} from "./env.js"


export const connection = async () => {
    try{
       await mongoose.connect(ENV.MONGO_URI)
        console.log("connected")
    }catch(error){
        console.log("connect error")
        process.exit(1)
    }
}

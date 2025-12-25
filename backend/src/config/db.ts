import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const {MONGODB_URL}= process.env ;
if(!MONGODB_URL){
    throw Error('MongoDB url not loaded from env')
}
export async function connectDB(){
    try{
        await mongoose.connect(MONGODB_URL as string);
        console.log("Connected to MongoDB");
    }catch(e){
        console.log(e)
        console.log("Error connecting to mongodb")
    }
}
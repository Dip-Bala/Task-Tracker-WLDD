import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/userSchema.js';
import dotenv from 'dotenv';
dotenv.config();

const admin_email = process.env.ADMIN_EMAIL as string;
const admin_password = process.env.ADMIN_PASSWORD as string;
const mongodb_url = process.env.MONGODB_URL as string;

if(!admin_email || !admin_password) throw Error("ADMIN credentials are not loaded from .env");

if(!mongodb_url) throw Error("mongoDB Url is not loaded from .env");

const seedDB = async() => {
    try{
        await mongoose.connect(mongodb_url);
        console.log("Connecetd to MongoDB successfully");

        const hashedPassword = await bcrypt.hash(admin_password, 10);
        await User.create({
            name: 'Hashibara Inosuke',
            email: admin_email,
            password: hashedPassword,
            role: 'ADMIN'
        });
        console.log("Data successfully seeded")
    }catch(e){
        console.error("Error seeding database:", e)
    }finally{
        mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
}

seedDB();
import mongoose from "mongoose";
import 'dotenv/config.js'; 


export const connectDB = async () => { 

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); 
            console.log("Connected to MongoDB");
    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`); 
        process.exit(1);
    }
 }

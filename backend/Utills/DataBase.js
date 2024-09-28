import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB

const DB = process.env.MONGODB_URI;

const DataBaseConnection =async ()=>{
    if(!DB){
        console.error('Error: MONGODB_URI environment variable not set.');
        process.exit(1);
    }
    try {
        await mongoose.connect(DB);
    } catch (error) {
        console.error('Failed to Connect to MongoDB...', error);
        process.exit(1); // Exit the process with failure
    }
}


export default DataBaseConnection;
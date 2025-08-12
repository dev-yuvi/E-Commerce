import mongoose from "mongoose";

export const ConnectDB= async () => {
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`The Database is connected to the host ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in Connecting to the Database",error.message);
    }
}
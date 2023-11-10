import mongoose from "mongoose";


export const connectDb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB);
      console.log("Connected to mongoDB.");
      mongoose.connection.on("disconnected", () => {
        console.log("mongoDB disconnected!");
      });
    } catch (error) {
      throw error;
    }
  };
  

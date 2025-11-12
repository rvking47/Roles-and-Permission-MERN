import mongoose from "mongoose";

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_SERVER);
        console.log("Database is connected!!");
    }
    catch (err) {
        console.error("Database is not connected!!", err.message);
    }
}
export default ConnectDB;
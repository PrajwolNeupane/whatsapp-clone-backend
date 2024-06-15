import mongoose from "mongoose";
import "dotenv/config";

export default mongoose
    .connect(`${process.env.MONGODB_URL}`)
    .then(() => {
        console.log("Connected to Mongo DB");
    })
    .catch((e) => {
        console.log("Error on connecting Mongo DB");
        console.log(e.message);
    });
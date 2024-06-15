import mongoose from "mongoose";


const UserModel = new mongoose.Schema({
    username: {
        type: String, required: true
    },
    email: {
        type: String, required: true,
    },
    photo: { type: String, required: true },
    password: { type: String, required: false },
    googleUID: { type: String, required: false }
});

const User = mongoose.model("User", UserModel);
export default User;
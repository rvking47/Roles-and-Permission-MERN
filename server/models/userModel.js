import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

const User = mongoose.model("authUser", userSchema);

export default User;
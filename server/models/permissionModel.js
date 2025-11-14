import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true     //create_user, update_user etc
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Permission = mongoose.model("permission", permissionSchema);

export default Permission;


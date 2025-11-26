import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Role from "../models/roleModel.js";

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All Field is required!!" })
        }

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: "This email id already register!!" });
        }

        const existingRole = await Role.findOne({ name: role });
        if (!existingRole) return res.status(400).json({ message: "Invalid role" });

        const user = new User({
            username,
            email,
            password,
            role: existingRole._id
        });
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(201).json({ message: `${username} User registered successFully!!`, user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All Field is required!!" })
        }
        const user = await User.findOne({ username }).populate({
            path: "role",
            populate: { path: "permissions" }
        });
        if (!user) {
            return res.status(404).json({ message: "Username and password wrong!!" });
        }

        const hashpassword = await bcrypt.compare(password, user.password);
        if (!hashpassword) {
            return res.status(404).json({ message: "Username and password wrong!!" });
        }

        const jwtToken = jwt.sign({ _id: user._id, username: user.username, role: user.role.name, permissions: user.role.permissions.map(p => p.name) }, process.env.API_SECRETKEY, {
            expiresIn: "5d"
        });

        user.isLoggedIn = true;
        user.lastLoginAt = new Date();
        await user.save();

        res.status(200).json({ message: `${username} user login successFully!!`, token: jwtToken, user: { _id: user._id, username: user.username, email: user.email, role: user.role.name, isLoggedIn: user.isLoggedIn, lastLoginAt: user.lastLoginAt, permissions: user.role.permissions.map(p => p.name) } });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

}

const logout = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required!" });
        }
        const user = await User.findByIdAndUpdate(id, { $set: { isLoggedIn: false } }, {
            new: true
        });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({ message: "Logout SuccessFully!!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export { register, login, logout };
import User from "../models/userModel.js";

const view = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status(402).json({ message: "User not found!!" })
        }
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const result = await User.findById(id);
        if (!result) {
            return res.status(402).json({ message: "User Id not found!!" })
        }
        const updateUser = {
            username: username || result.username,
            email: email || result.email,
            password: password || result.password,
        }
        const response = await User.findByIdAndUpdate(id, {
            $set: updateUser
        }, { new: true });
        res.status(200).json({ message: "User profile updated!!", response })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const newuser = async (req, res) => {
    try {
        const fiveDays = new Date();
        fiveDays.setDate(fiveDays.getDate() - 5);

        const users = await User.find({ createdAt: { $gte: fiveDays } });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No new users in last 5 days!" })
        }
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export { view, update, newuser };
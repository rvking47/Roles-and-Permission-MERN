import Permission from "../models/permissionModel.js";

const create = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "All Field is required!!" })
        }
        const existPermissions = await Permission.findOne({ name });
        if (existPermissions) {
            return res.status(400).json({ message: "Permissions already exists!" });
        }
        const permission = new Permission({
            name,
            description
        });
        await permission.save();
        res.status(201).json({ message: `${name} Permission created!!`, permission })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const view = async (req, res) => {
    try {
        const permission = await Permission.find({});
        if (!permission) {
            return res.status(400).json({ message: "Permissions not found" });
        }
        res.status(200).json(permission)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const single = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findOne({ _id: id });
        if (!permission) {
            return res.status(400).json({ message: "This id is not found!!" });
        }
        res.status(200).json({ permission })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const distroy = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.deleteOne({ _id: id });
        if (!permission) {
            return res.status(400).json({ message: "This id is not found!!" });
        }
        res.status(200).json({ message: "Permission deleted!!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "All Field is required!!" })
        }
        const permission = await Permission.findById(id);
        if (!permission) {
            return res.status(400).json({ message: "This id is not found!!" });
        }
        const updatePermission = {
            name: name || permission.name,
            description: description || permission.description
        }

        const result = await Permission.findByIdAndUpdate(id, {
            $set: updatePermission
        },
            { new: true }
        );

        res.status(200).json({ message: "Permission Updated!!", result });

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export { create, view, single, distroy, update };
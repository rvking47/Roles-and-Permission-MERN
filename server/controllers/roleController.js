import Permission from "../models/permissionModel.js";
import Role from "../models/roleModel.js";


const create = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        if (!name) {
            return res.status(400).json({ message: "All Field is required!!" })
        }
        const existRole = await Role.findOne({ name });
        if (existRole) {
            return res.status(400).json({ message: "Role already exists!" });
        }
        // Validate permission IDs
        const validPermission = await Permission.find({ _id: { $in: permissions } });
        if (!validPermission) {
            return res.status(400).json({ message: "This permission name is not found!!" });
        }
        const role = new Role({
            name,
            permissions: validPermission.map(p => p._id)
        });
        await role.save();
        res.status(200).json({ message: "Role created!!", role });

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const view = async (req, res) => {
    try {
        const role = await Role.find({});
        if (!role) {
            return res.status(400).json({ message: "Permissions not found" });
        }
        res.status(200).json({ role })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const single = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findOne({ _id: id });
        if (!role) {
            return res.status(400).json({ message: "This id is not found!!" });
        }
        res.status(200).json({ role });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const distroy = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.deleteOne({ _id: id });
        if (!role) {
            return res.status(400).json({ message: "This id is not found!!" });
        }
        res.status(200).json({ message: "Role deleted!!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;
        if (!name) {
            return res.status(400).json({ message: "All Field is required!!" })
        }
        const role = await Role.findById(id);
        if (!role) {
            return res.status(400).json({ message: "Role not found!!" });
        }

        let validatePermission = role.permissions;

        if (permissions && Array.isArray(permissions)) {
            const fetchedPermissions = await Permission.find({ _id: { $in: permissions } });

            if (fetchedPermissions.length !== permissions.length) {
                return res.status(400).json({ message: "Some permission IDs are invalid!" });
            }
            validatePermission = fetchedPermissions.map(p => p._id)
        }
        if (!validatePermission) {
            return res.status(400).json({ message: "This permission name is not found!!" });
        }

        const updateRole = {
            name: name || role.name,
            permissions: validatePermission
        }

        const result = await Role.findByIdAndUpdate(id, {
            $set: updateRole
        }, { new: true });
        res.status(200).json({ message: "Role updated!!", result });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export { create, view, single, distroy, update };

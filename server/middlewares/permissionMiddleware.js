const authPermission = (...requiredPermissions) => {
    return (req, res, next) => {
        const userPrmissions = req.user.permissions;

        const hashPermission = requiredPermissions.every(p =>
            userPrmissions.includes(p)
        );
        if (!hashPermission) {
            return res.status(403).json({ message: "Permission denied!" });
        }
        next();
    }
}
export default authPermission;
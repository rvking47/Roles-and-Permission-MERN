import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {

    const authHeaders = req.headers["authorization"];
    if (!authHeaders) {
        return res.status(402).json({ message: "No token, authorization Error!!" });
    }

    const token = authHeaders.split(" ")[1];
    if (!token) {
        return res.status(402).json({ message: "No token, authorization Error!!" });
    }
    try {
        const decode = jwt.verify(token, process.env.API_SECRETKEY);
        req.user = decode;
        next();
      //  console.log("the decoded user is :", req.user);
    }
    catch (err) {
        
        if(err.name=== "TokenExpiredError")
        {
            const decode=jwt.decode(token);
            if(decode && decode._id)
            {
                await User.findByIdAndUpdate(decode._id,{
                    isLoggedIn:false
                });
            }
            res.status(402).json({
                message:"Token expired, please log in again."
            })
        }

        res.status(500).json({ message: err.message });
    }
}

export default authMiddleware;
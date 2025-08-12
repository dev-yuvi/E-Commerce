import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const productRoute = async(req, res, next) => {
   try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(401).json({ message: "Unauthorized - no Access Token Provided" });
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user;
            next();
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Access Token Expired" });
            }
            throw error;
        }
} 
    catch (error) 
    {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}

export const adminRoute = (req, res, next) => {
   if(req.user && req.user.role==="admin"){
    next();
   }
   else
   {
    return res.status(403).json({message:"Access Denied - admin only"})
   }
};

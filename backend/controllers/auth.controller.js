import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js"



const genarateToken=(userId)=>{
        const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"15m"

            });
        const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:"7d"
        });
        return {accessToken,refreshToken};
}

const storeRefreshToken=async (userId,refreshToken) => {
        await redis.set(`Refresh_Token${userId}`,refreshToken,"EX",7*24*60*60);//7 days
}

const setCookies=(res,accessToken,refreshToken)=>{
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite:"strict",
            maxAge:15*60*1000 // 15 minutes
        });
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite:"strict",
            maxAge:7*24*60*60*1000 // 7 days
        });
}

export const signup = async (req,res)=>{

    const {email, password, name}=req.body
    try {
        const userExists=await User.findOne({email})
        if(userExists){
            res.status(400).json({message:"User Already Exists"})
        }
        const user=await User.create({name,email,password});

        // authendication
        const{accessToken,refreshToken}=genarateToken(user._id);  
        await storeRefreshToken(user._id,refreshToken)  ;  
        setCookies(res,accessToken,refreshToken);
        res.status(201).json({user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        },message:"User Created Sucessfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = genarateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            return res.status(200).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                message: "Login Successfully"
            });
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const logout = async (req,res)=>{
    const refreshToken=req.cookies.refreshToken;
    if(refreshToken){
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`Refresh_Token${decoded.userId}`);
    }
    res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message:"Logout Sucessfully"})
}

export const refreshToken = async (req, res) => {
    try {
         const refreshToken=req.cookies.refreshToken;
         if(!refreshToken){
         return res.status(401).json({message:"No Refresh Token Provided"});
        }
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const storeRefreshToken=await redis.get(`Refresh_Token${decoded.userId}`);
        if(storeRefreshToken !== refreshToken){
            return res.status(403).json({message:"Invalid Refresh Token"});
        }

        const accessToken=jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"15m"
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.status(200).json({message:"Token Refreshed Sucessfully",accessToken});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
   
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error getting profile", error);
        res.status(500).json({ message: "Something went wrong"})
    }
}
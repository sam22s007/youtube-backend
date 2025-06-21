import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
export const verifyJWT=asynchandler(async(req,res,next)=>
{
   try {
      console.log("Cookies:", req.cookies);
console.log("Authorization Header:", req.header("Authorization"));
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
console.log("Token received:", token);
    if(!token)
     throw new ApiError(401,"unauthorized request")
  const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 const user=await User.findById(decodedtoken?._id).select("-password -refreshToken")
 if(!user)
     throw new ApiError(401,"Invalid access token")
  req.user=user
  next()
   } catch (error) {
    throw new ApiError(401,error?.message||"Invalid access token")
   }
})
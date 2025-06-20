import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
export const verifyJWT=asynchandler(async(req,res,next)=>
{
   try {
    const token= req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    if(!token)
     throw new ApiError(401,"unauthorized request")
  const decodedinfo=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 const user=await User.findById(decodedtoken?._id).select("-password -refreshToken")
 if(!user)
     throw new ApiError(401,"Invalid access token")
  req.user=user
  next()
   } catch (error) {
    throw new ApiError(401,error?.message||"Invalid access token")
   }
})
import {asynchandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import { use } from 'react'
import {User} from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser= asynchandler(async (req,res)=>
{
const {username,email,fullname,password}=req.body
console.log("email:",email)
   if([fullname,email,username,password].some((field)=>field?.trim()===""))
   {
    throw new ApiError(400,"All fields are required")
   }
  const existedUser= User.findOne({$or:[{username},{email}]})
  if(existedUser)
  {
    throw new ApiError(409,"User with email or username exists")
  }
  const avatarlocalpath=req.files?.avatar[0]?.path
  const coverimglocalpath=req.files?.coverimg[0]?.path
  if(!avatarlocalpath)
  {
    throw new ApiError(400,"Avatar is required")
  }
 const avatarimg = await uploadOnCloudinary(avatarlocalpath)
 const coverimage= await uploadOnCloudinary(coverimglocalpath)
 if(!avatarimg)
    throw new ApiError(400,"Avatar is required")
 const user = await User.create({
    username:username.toLowerCase(),fullname,email,password,avatar:avatarimg.url,coverimg:coverimage?.url||"",
 })
 const createduser=await User.findById(user._id).select("-password -refreshtoken")
 if(!createduser)
    throw new ApiError(500,"Something went wrong while registering user")
return res.status(201).json(
    new ApiResponse(201, createduser, "User registered successfully")
)
})
export {registerUser}
import {asynchandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ref } from 'process'
const generateAccessandRefreshToken=async(userid)=>
{
  try {
    const user=await User.findById(userid)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken
   await user.save({validateBeforeSave:false})
   return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access and refresh token")
  }
}
const registerUser= asynchandler(async (req,res)=>
{
const {username,email,fullname,password}=req.body
console.log("email:",email)
   if([fullname,email,username,password].some((field)=>field?.trim()===""))
   {
    throw new ApiError(400,"All fields are required")
   }
  const existedUser= await User.findOne({$or:[{username},{email}]})
  if(existedUser)
  {
    throw new ApiError(409,"User with email or username exists")
  }
  const avatarlocalpath=req.files?.avatar[0]?.path
  let coverimglocalpath;
  if(req.files && Array.isArray(req.files.coverimg) && req.files.coverimg.length>0)
      coverimglocalpath=req.files.coverimg[0].path
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
const loginUser= asynchandler(async(req,res)=>
{
  const {email,username,password}=req.body
  if(!username && !email)
    throw new ApiError(400,"Username or Email required")
  const user=User.findOne(
    {
      $or: [{username},{email}]
    }
  )
  if(!user)
    throw new ApiError(404,"User does not exist")
  const validity=await user.isPasswordCorrect(password)
  if(!validity)
    throw new ApiError(401,"Incorrect Password")
  const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)
  const loggedinuser= await User.findById(user._id).select("-password -refreshToken")
const options=
{
  httpOnly:true,
  secure:true
}
res.status(200).cookie("accessToken",accessToken,options).cookie("refrehToken",refreshToken).json(
  
    new ApiResponse(200,{
      user:loggedinuser,accessToken,refreshToken
    },
  "User logged in successfully")
)
})
const logoutUser=asynchandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
      {
        new:true
      }
  )
  const options=
{
  httpOnly:true,
  secure:true
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options.json(
  new ApiResponse(200,{},"User logged out")
)
)})
export {registerUser,loginUser,logoutUser}
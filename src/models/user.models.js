import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { JsonWebTokenError } from "jsonwebtoken";
const userSchema=new Schema({
    username:
    {
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    email:
    {
       type:String,
       required:true,
        unique:true,
      lowercase:true,
      trim:true
    },
    fullname:
    {
      type:String,
      required:true,
      trim:true,
      index:true
    },
    avatar:
    {
        type:String,
        required:true
    },
    coverimg:
    {
       type:String
    },
    password:
    {
        type:String,
        required:[true,"Password is required"]
    },
    refreshtoken:
    {
        type:String
    },
    watchhistory:
    [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Video"
    }
]
},{timestamps:true})
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect= async function(password)
{
   return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function()
{
    return jwt.sign(
        {
            __id:this.__id,
            username:this.username,
            email:this.email,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function()
{
    return jwt.sign(
        {
            __id:this.__id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)
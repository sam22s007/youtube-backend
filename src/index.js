import dotenv from "dotenv"
dotenv.config({path:'./.env'})
import connectdb from "./db/index.js";
import { app } from "./app.js";
connectdb().then(()=>
{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running on port:${process.env.PORT}`)
    })
}).catch((err)=>
{
    console.log("MONGO DB collection failerd!!",err)
})
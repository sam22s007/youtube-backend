import dotenv from "dotenv"
dotenv.config({path:'./.env'})
import connectdb from "./db/index.js";
connectdb()
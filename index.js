import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import cookieParser from "cookie-parser";
import UserRoute from './Routes/UserRoute.js';
import path from "path";
import cors from "cors"

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://cicada-frontend.onrender.com",
      "https://cicada-old.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,  
  })
);
dotenv.config();

connectDB();
// const _dirname = path.resolve();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/team',UserRoute)


const port = process.env.PORT;
 
app.listen(port, () => console.log(`http://localhost:${port}`));

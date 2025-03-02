import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import cors from 'cors';
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { addstudentrouter , router,updatestudent, photorouter } from './routes/studentroutes.js';
import { addfacultyrouter ,staffrouter ,staffrouter1 , router1} from './routes/facultyroutes.js';
import studentatt  from './routes/attendance.js';
import  studentattendance from './routes/attendance.js'
import eventrouter from './routes/eventroutes.js';
import countrouter from './routes/count.js';
import mentorrouter from './routes/mentoershiproutes.js';
import courserouter from './routes/courseroutes.js';
import markrouter from './routes/markroute.js';
import adminmentierouter from './routes/adminmentie.js';

import authrouter from './routes/authentication.js';
import degreerouter from './routes/degreeRoutes.js';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

connectToDB();

app.use('/addstudents', addstudentrouter);
app.use('/api/students', router);
app.use('/update/updatestudent/',updatestudent);
app.use('/api/studentattendance',studentatt)

app.use('/api/photostudents',photorouter);

app.use("/faculty", addfacultyrouter);

app.use("/api/staff", staffrouter);

app.use("/api/faculty",staffrouter1 );
app.use("/api/faculties",router1 );

app.use("/loginapi",authrouter);

app.use('/api/attendance',studentattendance )
app.use('/apievent', eventrouter);

app.use('/apicount',countrouter);
app.use('/api/degrees',degreerouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/apimentorrship', mentorrouter);

app.use('/apicourses',courserouter)

app.use('/apimark',markrouter)
app.use('/apiadminmentie',adminmentierouter)

app.use('/Student_photo', express.static(path.join(__dirname, 'Students_photo')));

app.get("/", (req, res) => {
    res.send("Welcome to the Student Management API");
  });
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));      
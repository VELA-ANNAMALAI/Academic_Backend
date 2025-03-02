// routes/studentRoutes.js
import express from 'express';
import { getStudentGeneralData, getStudentMentorshipData } from '../controller/adminmentiecontroller.js';

const adminmentierouter = express.Router();

// Route to get general data by register number
adminmentierouter.get('/generaldata/:registerno', getStudentGeneralData);

// Route to get mentorship data by register number
adminmentierouter.get('/mentorship/:registerno', getStudentMentorshipData);

export default adminmentierouter;
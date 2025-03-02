import express from 'express';
import { getStudents, submitAttendance,getAttendanceReport,checkAttendance,checkUpdateAttendance ,updatesubmitAttendance} from '../controller/studentattendance.js';

const studentattendance = express.Router();

// Route to get students based on criteria
studentattendance.post('/students', getStudents);

// Route to submit attendance
studentattendance.post('/submit', submitAttendance);

studentattendance.post('/updatesubmit',updatesubmitAttendance);

studentattendance.post('/check',checkAttendance);

studentattendance.post('/checkupdate',checkUpdateAttendance);


studentattendance.post('/report', getAttendanceReport);

export default studentattendance;
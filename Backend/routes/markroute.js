import express from 'express';
import { fetchCourses ,fetchStudents,submitMarks,fetchMarks,bulkuploadmark} from '../controller/markcontroller.js';
import multer from 'multer';

const markrouter = express.Router();
const upload = multer();

// Define the route for fetching courses
markrouter.get('/subjects', fetchCourses);
markrouter.get('/students', fetchStudents);
markrouter.post('/submitMarks', submitMarks);
markrouter.get('/marks', fetchMarks);
markrouter.post('/bulkupload', upload.single('file'), bulkuploadmark);


export default markrouter;
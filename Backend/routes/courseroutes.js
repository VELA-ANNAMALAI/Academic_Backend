// routes/courseRoutes.js
import express from 'express';
import { getCoursesByDepartment, addCourse,updateCourse,deleteCourse } from '../controller/coursecontroller.js';

const courserouter = express.Router();

// Route to fetch courses by department
courserouter.get('/fetchcourse/:department', getCoursesByDepartment);

// Route to add a new course
courserouter.post('/addcourse/:department', addCourse);

courserouter.put('/updatecourse/:id', updateCourse);

// Route to delete a course
courserouter.delete('/deletecourse/:id', deleteCourse);

export default courserouter;
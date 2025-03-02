import express from "express";
import {getDegrees,addDegree,updateDegree,deleteDegree,getCoursesByDepartmentAndType} from '../controller/degreeController.js'
const degreerouter = express.Router();

// Route to add a new degree
degreerouter.post('/', addDegree);

// Route to get all degrees
degreerouter.get('/', getDegrees);
degreerouter.put("/:id", updateDegree); // Update route
degreerouter.delete("/:id", deleteDegree);
// In your routes/degreeroutes.js
degreerouter.get('/courses', getCoursesByDepartmentAndType);

export default degreerouter ;
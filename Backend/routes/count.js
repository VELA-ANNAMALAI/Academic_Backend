import express from 'express';
import { getCounts } from '../controller/countcontroller.js'; // Import the controller

const countrouter = express.Router();

// Route to get total counts
countrouter.get('/counts', getCounts);

export default countrouter;
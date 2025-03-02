// routes/authRoutes.js
import express from 'express';
import { login } from '../controller/authentication.js'; // Adjust the path as necessary

const authrouter = express.Router();

// Unified login route for both admin and faculty
authrouter.post('/auth/login', login);

export default authrouter;
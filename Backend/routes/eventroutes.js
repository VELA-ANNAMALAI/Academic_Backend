import express from 'express';
import { addEvent,getEventById, getTodaysEvents, getAllEvents, upload ,getUpcomingEvents,updateEvent,deleteEvent,uploadFlyer,deleteFlyer} from '../controller/Eventcontroller.js';

const eventrouter = express.Router();

// Route to add an event with file upload
eventrouter.post('/events', upload.single('flyer'), addEvent);

// Route to get today's events
eventrouter.get('/events/today', getTodaysEvents);

eventrouter.get('/events/upcoming', getUpcomingEvents);

eventrouter.get('/events', getAllEvents);

eventrouter.get('/events/:id', getEventById);

eventrouter.put('/events/:id/upload-flyer', upload.single('flyer'), uploadFlyer);
// Route to delete an event
eventrouter.delete('/events/:id', deleteEvent);
eventrouter.delete('/events/:id/delete-flyer', deleteFlyer);
eventrouter.put('/updateevents/:id',updateEvent)
// Route to upload a new flyer
eventrouter.put('/events/:id/upload-flyer', upload.single('flyer'), uploadFlyer);

export default eventrouter;
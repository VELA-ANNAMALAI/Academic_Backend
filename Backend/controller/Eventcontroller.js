import Event from '../schema/EventSchema.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import the fs module
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// Add a new event
export const addEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      flyer: req.file ? req.file.path : null, // Save the file path if uploaded
    });
    await newEvent.save();
    res.status(201).json({ message: "Event added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error: error.message });
  }
};

// Get today's events
export const getTodaysEvents = async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const events = await Event.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's events", error: error.message });
  }
};

// Export the upload middleware for use in routes
export { upload };

// In e:\College_Management\Backend\controller\Eventcontroller.js
export const getUpcomingEvents = async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    
    try {
      const upcomingEvents = await Event.find({
        date: { $gte: startOfDay },
      }).sort({ date: 1 }); // Sort by date ascending
  
      if (upcomingEvents.length === 0) {
        return res.status(404).json({ message: 'No upcoming events found' });
      }
  
      res.status(200).json(upcomingEvents);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
    }
  };

  export const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find(); // Fetch all events from the database
      res.status(200).json(events); // Return the events as a JSON response
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events", error: error.message });
    }
  };


  export const getEventById = async (req, res) => {
    const { id } = req.params; // Get the event ID from the request parameters
  
    try {
      const event = await Event.findById(id); // Find the event by ID
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(event); // Return the event details
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Error fetching event", error: error.message });
    }
  };

  export const deleteFlyer = async (req,res) => {
    try {
      // Find the event by ID
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      // Check if the flyer exists
      if (event.flyer) {
          const filePath = path.join(__dirname, '../', event.flyer);
          console.log("Attempting to delete file at:", filePath); // Log the file path

          // Check if the file exists before trying to delete it
          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Delete the file
              console.log("File deleted successfully:", filePath);
          } else {
              console.error("File not found:", filePath);
              return res.status(404).json({ message: "Flyer file not found" });
          }
      } else {
          console.warn("No flyer to delete for event:", event._id);
      }

      // Remove the flyer reference from the event
      event.flyer = null; 
      await event.save(); // Save the updated event
      res.json({ message: "Flyer deleted successfully", event });
  } catch (err) {
      console.error("Error deleting flyer:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
  }

  };

  export const uploadFlyer = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      if (req.file) {
        event.flyer = req.file.path; // Save the file path in the event
        await event.save();
        return res.status(200).json({ message: "Flyer uploaded successfully", event });
      } else {
        return res.status(400).json({ message: "No file uploaded" });
      }
    } catch (err) {
      console.error("Error uploading flyer:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
  
  export const deleteEvent = async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: 'Event deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const updateEvent = async (req, res) => {
    console.log(req.body)
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
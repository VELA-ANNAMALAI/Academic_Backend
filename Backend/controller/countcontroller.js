import  {Student} from '../schema/studentschema.js'; // Import the Student model
import  Faculty  from '../schema/facultyschema.js'; // Import the Faculty model
import Event from '../schema/EventSchema.js' // Import the Event model
import Course from '../schema/courseschema.js';

// Controller to get total counts
export const getCounts = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } }); // Fetch upcoming events
    const totalCourses = await Course.countDocuments(); // Fetch total courses

    res.json({
      totalStudents,
      totalFaculty,
      upcomingEvents: upcomingEvents.length,
        totalCourses,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

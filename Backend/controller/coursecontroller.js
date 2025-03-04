import Course from "../schema/courseschema.js";

// Fetch courses by department
export const getCoursesByDepartment = async (req, res) => {
  const { department } = req.params;

  try {
    const courses = await Course.find({ department });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new course
// Add a new course
export const addCourse = async (req, res) => {
  console.log(req.body)
  const { academicYear, courseName, subjects, semesters } = req.body; // Include semesters in the request body
  const department = req.params.department;

  // Validate input
  if (!academicYear || !courseName || !semesters || !Array.isArray(semesters)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const newCourse = new Course({
      academicYear,
      courseName,
      department,
      semesters, // Include semesters in the new course
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update an existing course
export const updateCourse = async (req, res) => {
  console.log("Update course params:", req.params);
  console.log("Update course body:", req.body);

  const { id } = req.params; // Extract the course ID from the request parameters
  const { academicYear, courseName, semesters } = req.body; // Ensure you are using 'semesters' instead of 'subjects'

  // Validate input
  if (!academicYear || !courseName || !semesters || !Array.isArray(semesters)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    // Update the course in the database
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { academicYear, courseName, semesters }, // Use 'semesters' here
      { new: true } // Return the updated document
    );

    // Check if the course was found and updated
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Respond with the updated course
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

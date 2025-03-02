import { Student } from '../schema/studentschema.js'; // Import Student model

import { Mentorship } from '../schema/Mentorship/StudentMentorshipReport.js'

import GeneralDataStudent from '../schema/Mentorship/Generaldata.js'

import Mark from '../schema/mark.js';

import Course from '../schema/courseschema.js';
// Controller to fetch students based on faculty mentorship
export const getStudentsByFaculty = async (req, res) => {
  try {
    const facultyName = req.query.facultyName; // Get faculty name from the query parameter
    if (!facultyName) {
      return res.status(400).json({ message: 'Faculty name is required' });
    }

    // Fetch students whose mentorship matches the faculty name
    const students = await Student.find({ mentorship: facultyName });
    console.log('Fetched students:', students); // Log the fetched students

    // If no students are found
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students assigned to this faculty' });
    }

    // Send the list of students as a response
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const fetchMentorshipReport = async (req, res) => {

  console.log(req.params)
  const { registerNumber } = req.params;

  try {
    const report = await Mentorship.find({ registerNumber });
    if (!report || report.length === 0) {
      return res.status(404).json({ message: 'No mentorship report found for this register number' });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching mentorship report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Save or update mentorship report
export const saveMentorshipReport = async (req, res) => {
  console.log("save data ", req.body);
  const { registerNumber, issues, id, course } = req.body; // Destructure the incoming data

  // Validate incoming data
  if (!registerNumber) {
    return res.status(400).json({ message: 'Register number is required.' });
  }

  const studentId = id; // Get student ID from URL

  try {
    // Check if a mentorship report already exists for the given register number
    let report = await Mentorship.findOne({ registerNumber });

    if (issues.length === 0) {
      // If issues are empty, delete the report if it exists
      if (report) {
        await Mentorship.deleteOne({ registerNumber });
        return res.status(200).json({ message: 'Mentorship report deleted successfully.' });
      } else {
        return res.status(404).json({ message: 'No report found to delete.' });
      }
    }

    if (!report) {
      // If no report exists, create a new one
      report = new Mentorship({
        registerNumber,
        issues: issues || [], // Allow empty issues
        course,
      });
    } else {
      // If a report exists, update it
      report.issues = issues; // Update issues
      report.course = course; // Update course
    }

    // Save the report to the database
    await report.save();

    // Respond with success message and the saved report
    res.status(200).json({ message: 'Mentorship report saved successfully', report });
  } catch (error) {
    console.error('Error saving mentorship report:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete an issue by ID
export const deleteIssue = async (req, res) => {
  try {
    const report = await Mentorship.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Mentorship report not found' });
    }
    report.issues.id(req.params.issueId).remove(); // Remove the issue by ID
    await report.save();
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const fetchEvaluationSubjects = async (req, res) => {
  const { course, semester, academicYear } = req.query;

  try {
    // Find the course by name and academic year
    const courseData = await Course.findOne({
      courseName: course,
      academicYear: academicYear,
    });

    if (!courseData) {
      return res.status(404).json({ message: "Course or Academic Year not found" });
    }

    // Find the semester data
    const semesterData = courseData.semesters.find(sem => sem.semesterName === semester);

    if (!semesterData) {
      return res.status(404).json({ message: "Semester not found" });
    }

    return res.status(200).json({
      subjects: semesterData.subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ message: "Error fetching subjects" });
  }
};
// Fetch marks based on student registration number, academic year, semester, and exam type
export const fetchEvaluationMarks = async (req, res) => {
  console.log(req.query)
  const { registerno, academicYear, semester, examType } = req.query;

  try {
    const marks = await Mark.find({
      registerno,
      academicYear,
      semester,
      examType,
    });

    return res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    return res.status(500).json({ message: "Error fetching marks" });
  }
};

export const getStudentDetails = async (req, res) => {
 console.log("get studnet",req.params)
  const { registerno } = req.params; // Get the registration number from the request parameters

  try {
    const student = await GeneralDataStudent.findOne({ registerno });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const submitData = async (req, res) => {
  try {
      const { registrationNumber, name, course,academicyear,section, semesterData } = req.body;
      const registerno = registrationNumber;

      // Validate required fields
      if (!registerno || !name || !course || !semesterData) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if the student already exists
      const existingStudent = await GeneralDataStudent.findOne({ registerno });

      if (existingStudent) {
          // Update existing student
          await GeneralDataStudent.updateOne(
              { registerno },
              { $set: { name, course,academicyear,section, semesterData } }
          );
          return res.status(200).json({ message: 'Student data updated successfully' });
      }

      // Create a new student record
      const newStudent = new GeneralDataStudent({
          registerno,
          name,
          course,
          section,
          academicyear,
          semesterData
      });

      await newStudent.save();
      res.status(201).json({ message: 'New student data saved successfully' });
  } catch (error) {
      console.error("Error in submitsemesterdata route:", error);
      res.status(500).json({ error: 'Failed to create new student entry', details: error.message });
  }
};

export const createGeneralData = async (req, res) => {
  console.log("Received data:", req.body);
  const { registerno, name, course,academicyear,section, semesterData } = req.body;

  // Validate registration number
  if (!registerno) {
      return res.status(400).json({ message: 'Registration number is required.' });
  }

  try {
      const existingStudent = await GeneralDataStudent.findOne({ registerno });
      if (existingStudent) {
          return res.status(400).json({ message: 'Student already exists.' });
      }

      const newStudent = new GeneralDataStudent({
          registerno,
          name,
          course,
          section,
          academicyear,
          semesterData,
      });

      await newStudent.save();
      return res.status(201).json({ message: 'Student data created successfully', data: newStudent });
  } catch (error) {
      console.error('Error creating student data:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};
// Get submitted data by registration number
export const getSubmittedData = async (req, res) => {
  console.log("✅ Request received in getSubmittedData");

  const { registrationNumber } = req.params;
  console.log("🔍 Searching for registration number:", registrationNumber);

  try {
    // Log all records in the database
    const allRecords = await GeneralDataStudent.find();
    console.log("📂 Database Records:", allRecords);

    // Fetch student data
    const student = await GeneralDataStudent.findOne({ registerno: registrationNumber });

    if (!student) {
      console.log("❌ No data found for:", registrationNumber);
      return res.status(404).json({ message: `No data found for ${registrationNumber}` });
    }

    console.log("✅ Data Found:", student);
    res.json(student.semesterData);
  } catch (error) {
    console.error("🔥 Error fetching submitted data:", error);
    res.status(500).json({ message: "Error fetching submitted data" });
  }
};

import Course from '../schema/courseschema.js';
import {Student} from '../schema/studentschema.js';
import Mark from '../schema/mark.js'; // Import your Student model
import XLSX from 'xlsx'
import { parse } from 'xlsx';

export const fetchCourses = async (req, res) => {
  console.log("Request Query:", req.body); // Log the incoming query

  try {
    const { course, semester } = req.query;
  
    // Fetch courses from MongoDB (adjust to your model)
    const courses = await Course.find({ courseName: course });
  
    // Check if semester is provided in the query
    if (semester) {
      // Filter the courses based on the provided semester
      const filteredCourses = courses.map(course => {
        const semesters = course.semesters.filter(sem => sem.semesterName === semester);
        return { ...course, semesters };
      });
  
      // Flatten the filtered courses to get subjects for the specific semester
      const subjects = filteredCourses.flatMap(course =>
        course.semesters.flatMap(sem =>
          sem.subjects.map(subject => ({
            subCode: subject.subCode,
            title: subject.title,
            semester: sem.semesterName,  // Include semester name or number
          }))
        )
      );
  
      return res.status(200).json({
        message: `Subjects for ${semester}`,
        subjects: subjects
      });
    }
  
    // If no semester is specified, return all subjects
    const allSubjects = courses.flatMap(course =>
      course.semesters.flatMap(sem =>
        sem.subjects.map(subject => ({
          subCode: subject.subCode,
          title: subject.title,
          semester: sem.semesterName,  // Include semester name or number
        }))
      )
    );
  
    return res.status(200).json({
      message: "All subjects for the course",
      subjects: allSubjects
    });
  
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Fetch students based on course, academic year, section, and semester
export const fetchStudents = async (req, res) => {
  const { course, academicYear, section } = req.query;

  try {
    // Build the query object based on provided parameters
    const query = {
      course,
      academicYear,
      section,
    };

    // Fetch students from the database
    const students = await Student.find(query);
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const submitMarks = async (req, res) => {
  try {
    const marksData = req.body;

    // Debugging: Check what is received
    console.log("Received data:", marksData);

    // Ensure `marksData` is an array
    if (!Array.isArray(marksData)) {
      return res.status(400).json({ message: "Expected an array of marks data" });
    }

    for (const entry of marksData) {
      // Check if marks exist and are an array
      if (!entry.marks || !Array.isArray(entry.marks)) {
        console.error("Invalid marks format for:", entry);
        return res.status(400).json({ message: "marks must be an array of {subCode, score} objects" });
      }

      const { registerno, marks, academicYear, course, section, semester, examType } = entry;

      if (!registerno || !academicYear || !course || !section || !semester || !examType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Ensure each mark entry has subCode and score
      for (const mark of marks) {
        if (!mark.subCode || mark.score === undefined) {
          console.error("Invalid mark entry:", mark);
          return res.status(400).json({ message: "Each mark entry must have subCode and score" });
        }
      }

      // Check if a mark entry already exists for the student
      let existingMark = await Mark.findOne({ registerno, academicYear, semester, examType });

      if (existingMark) {
        // Update existing marks
        existingMark.marks = marks;
        await existingMark.save();
      } else {
        // Create a new mark entry
        const newMark = new Mark({
          registerno,
          academicYear,
          course,
          section,
          semester,
          examType,
          marks, // Save array of {subCode, score}
        });
        await newMark.save();
      }
    }

    res.status(200).json({ message: 'Marks submitted successfully' });
  } catch (error) {
    console.error("Error saving marks:", error);
    res.status(500).json({ message: "Error saving marks", error });
  }
};

export const fetchMarks = async (req, res) => {
  const { course, academicYear, section, semester,examType } = req.query;

  try {
    const marks = await Mark.find({ course, academicYear, section, semester,examType });
    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



export const bulkuploadmark = async (req, res) => {
  console.log("Uploaded file:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Read the workbook from the uploaded file buffer
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0]; // Get the first sheet name
  const worksheet = workbook.Sheets[sheetName]; // Get the first sheet
  const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert the sheet to JSON

  // Log the JSON data to see what was read
  console.log("Parsed JSON data:", jsonData);

  // Extract additional data from the request body
  const { academicYear, course, section, semester, examType } = req.body;

  try {
    // Process each record and save to the database
    for (const record of jsonData) {
      const registerno = record['Register No'];

      // Prepare marks array
      const marks = Object.keys(record)
        .filter(key => key !== 'Register No' && key !== 'Name') // Exclude Register No and Name
        .map(subCode => {
          const score = record[subCode]; // Get the score from the record
          return {
            subCode: subCode.trim(), // Subject Code
            score: score === '' ? null : (score === 'A' ? 'A' : (isNaN(score) ? null : Number(score))) // Handle empty scores, "A", and convert to number
          };
        })
        .filter(mark => mark.score !== null); // Exclude marks with null scores

      // Create a new Mark document
      const markEntry = new Mark({
        registerno,
        academicYear,
        course,
        section,
        semester,
        examType,
        marks
      });

      console.log("Saving Mark Entry:", markEntry); // Log the mark entry being saved

      // Save the mark entry to the database
      await markEntry.save();
    }

    return res.status(200).json({ message: "Marks uploaded successfully!" });
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).json({ message: "Error processing file" });
  }
};


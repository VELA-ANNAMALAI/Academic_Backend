import { addStudent, validateStudent } from "../model/student.js";
import { Student } from "../schema/studentschema.js";

import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

import  Faculty  from "../schema/facultyschema.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const getFacultyNames = async (req, res) => {
  try {
    const faculty = await Faculty.find({}, 'name'); // Fetch only the name field
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty names' });
  }
};

export const addStudentController = async (req, res) => {
  console.log(req.body); // Log the incoming request body
  try {
    // Directly access the student data from req.body
    const studentData = req.body; // No need to parse JSON

    const { registerno } = studentData;

    // Handle file upload
    if (req.file) {
      const tempPath = req.file.path; // Temporary path created by Multer
      const targetPath = path.join(__dirname, '../Students_photo', `${registerno}.jpg`); // Target path for the renamed file

      // Rename the file to register number
      fs.rename(tempPath, targetPath, (err) => {
        if (err) {
          console.error("Error renaming file:", err);
          return res.status(500).json({ message: "Error renaming file", error: err.message });
        }
      });

      studentData.photo = targetPath; // Store the file path in student data
    }

    // Create a new student instance
    const newStudent = new Student(studentData);

    // Add the student to the database
    await newStudent.save();
    return res.status(201).json({ message: "Student added successfully!" });
  } catch (error) {
    console.error("Error adding student:", error); // Log the error details
    return res.status(500).json({ message: "An error occurred while adding the student.", error: error.message });
  }
};
// Validate student data (for email and register number uniqueness)
export const validateStudentController = async (req, res) => {
  try {
    const { email, registerno,barcode,aadharno,abcid } = req.body;

    const validationResponse = await validateStudent({ email, registerno ,barcode,aadharno,abcid});

    if (validationResponse.isUnique) {
      return res.status(200).json({ isUnique: true });
    }

    res.status(400).json({ isUnique: false, message: validationResponse.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during validation." });
  }
};

export const updateStudentPhotoController = async (req, res) => {
  console.log("upload photo", req.params);
  const { registerno } = req.params; // Get registerno from the URL parameters

  try {
      // Find the student by register number
      const student = await Student.findOne({ registerno });
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      // Check if a file was uploaded
      if (req.file) {
          // Define the path for the old photo
          const oldPhotoPath = path.join(__dirname, '../Students_photo', `${registerno}.jpg`);

          // Delete the old photo if it exists
          if (fs.existsSync(oldPhotoPath)) {
              await fs.promises.unlink(oldPhotoPath); // Asynchronous deletion
          }

          // Define the new photo path
          const newPhotoPath = path.join(__dirname, '../Students_photo', `${registerno}.jpg`);

          // Ensure the directory exists
          const photoDir = path.join(__dirname, '../Students_photo');
          if (!fs.existsSync(photoDir)) {
              fs.mkdirSync(photoDir, { recursive: true }); // Create the directory if it doesn't exist
          }

          // Move the uploaded file to the new path
          await fs.promises.rename(req.file.path, newPhotoPath);

          // Update the student's photo field in the database
          student.photo = newPhotoPath; // Update the photo path in the student object
      }

      // Save the updated student document
      await student.save();

      // Respond with success message
      res.status(200).json({ message: "Photo updated successfully!", photo: student.photo });
  } catch (error) {
      console.error("Error updating photo:", error);
      res.status(500).json({ message: "An error occurred while updating the photo.", error: error.message });
  }
};
// Update student details by register number
export const searchStudent = async (req, res) => {
  try {
    console.log("Search Student Request:", req.body); // Detailed logging
    
    const { registerno, courseType, course, academicYear, section, department } = req.body;

    let query = {};

    if (registerno) {
      // Search by Register Number
      query.registerno = registerno;
    } else {
      // Search by Advanced Filters
      query.courseType = courseType;
      query.course = course;
      query.academicYear = academicYear;
      query.section = section;
      query.department = department;
    }

    // Find all matching students
    const students = await Student.find(query);

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found matching the criteria" });
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error searching for student:", err); // Detailed error logging
    res.status(500).json({ message: "Error searching for student", error: err.message });
  }
};

// Controller for updating a student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", updatedStudent });
  } catch (err) {
    console.error("Error updating student:", err); 
    res.status(500).json({ message: "Error updating student", error: err });
  }
};

// Controller for deleting a student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student", error: err });
  }
};


export const updatepagesearchStudent = async (req, res) => {
  try {
      const { registerno } = req.body;
      const student = await Student.findOne({ registerno });
      if (!student) {
          return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
  } catch (err) {
      res.status(500).json({ error: "Failed to search student", message: err.message });
  }
};

// Controller to update student details by ID
export const updatepageupdateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, course, year, department, section } = req.body;
  try {
      const updatedStudent = await Student.findByIdAndUpdate(
          id, 
          { name, course, year, department, section },
          { new: true }
      );
      if (!updatedStudent) {
          return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student updated", updatedStudent });
  } catch (err) {
      res.status(500).json({ error: "Failed to update student", message: err.message });
  }
};

// Controller to delete student by ID
export const updatepagedeleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
          return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student deleted successfully" });
  } catch (err) {
      res.status(500).json({ error: "Failed to delete student", message: err.message });
  }
};


export const updateStudentByRegisterno = async (req, res) => {
  const { registerno } = req.params; // Get registerno from the URL
  const updateData = req.body; // Get updated data from the request body

  try {
    const student = await Student.findOneAndUpdate({ registerno }, updateData, {
      new: true, // Return the updated document
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student); // Return the updated student
  } catch (err) {
    res.status(500).json({ error: "Failed to update student", message: err.message });
  }
};

// In studentcontroller.js
export const updateStudentpageByRegisterno = async (req, res) => {
  const { registerno } = req.params; // Get registerno from the URL
  const updateData = req.body; // Get updated data from the request body

  try {
    const student = await Student.findOneAndUpdate({ registerno }, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student); // Return the updated student
  } catch (err) {
    console.error("Error updating student:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to update student", message: err.message });
  }
};



export const getFieldNames = async (req, res) => {
  try {
    const fieldNames = Object.keys(Student.schema.paths);
    res.status(200).json(fieldNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateXLSX = async (req, res) => {
  try {
    // Extract fields from the schema, excluding specific fields
    const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v'];
    const schemaFields = Object.keys(Student.schema.paths).filter(
      (field) => !excludedFields.includes(field)
    );

    if (schemaFields.length === 0) {
      return res.status(404).json({ message: 'No fields found in the schema' });
    }

    // Convert field names to XLSX format
    const worksheet = XLSX.utils.aoa_to_sheet([schemaFields]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schema Fields');

    // Write workbook to buffer and send as response
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const fileName = `student_schema_fields_${Date.now()}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating XLSX with schema fields:', error);
    res.status(500).json({
      message: 'Error generating XLSX',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};


export const generateCSV = async (req, res) => {
  try {
    const students = await Student.find();
    const csvData = students.map(student => student.toObject());
    const csvFilePath = path.join(__dirname, 'students.csv');
    const csvString = csvData.map(row => Object.values(row).join(',')).join('\n');
    fs.writeFileSync(csvFilePath, csvString);
    res.download(csvFilePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkupload = async (req, res) => {
  console.log("Bulk upload initiated");
  try {
    const studentsData = Array.isArray(req.body.students) ? req.body.students : [];

    if (studentsData.length === 0) {
      return res.status(400).json({ message: 'No student data provided' });
    }

    // Extract all registernos from the incoming data
    const registernos = studentsData.map(student => student.registerno);

    // Check for existing registernos in the database
    const existingStudents = await Student.find({ registerno: { $in: registernos } });
    const existingRegisternos = existingStudents.map(student => student.registerno);

    // Filter out students that already exist
    const newStudentsData = studentsData.filter(student => !existingRegisternos.includes(student.registerno));

    if (newStudentsData.length === 0) {
      return res.status(400).json({ message: 'All provided students already exist in the database.' });
    }

    // Insert the new students into the database
    const result = await Student.insertMany(newStudentsData);

    res.status(201).json({
      message: 'Students added successfully',
      data: result
    });
  } catch (error) {
    console.error("Error during bulk upload:", error);
    res.status(500).json({
      message: 'Error adding students',
      error: error.message
    });
  }
};



export const BulkStudentDataDownload = async (req,res) =>{
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const photodelete = async (req, res) => {
  console.log("photo delete request received:", req.params);
  const { registerno } = req.params;

  try {
    const student = await Student.findOne({ registerno });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Define the full path of the photo
    const photoPath = path.join(__dirname, "../Students_photo", `${registerno}.jpg`);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath); // Synchronous deletion
      console.log(`Photo deleted: ${photoPath}`);

      // Update student photo field to null and save the change
      student.photo = null;
      await student.save();

      return res.status(200).json({ message: "Photo deleted successfully!" });
    } else {
      return res.status(404).json({ message: "No photo file found for this student" });
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    return res.status(500).json({ message: "An error occurred while deleting the photo.", error: error.message });
  }
};

export const bulkUploadPhotos = async (req, res) => {
  try {
    const files = req.files; // Access the uploaded files

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    // Process each file
    for (const file of files) {
      const studentId = file.originalname.split('.')[0]; // Assuming the filename is the student ID
      const targetPath = path.join(__dirname, '../Students_photo', `${studentId}.jpg`);

      // Rename the file to student ID
      await fs.promises.rename(file.path, targetPath);
    }

    return res.status(200).json({ message: 'Photos uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading photos:', error);
    return res.status(500).json({ message: 'Error uploading photos', error: error.message });
  }
};

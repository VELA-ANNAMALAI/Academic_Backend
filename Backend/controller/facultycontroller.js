import Faculty from "../schema/facultyschema.js";
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import express from 'express';
// Add faculty
const validateUniqueFields = async (email, staffId, barcode, phone) => {
  const existingFaculty = await Faculty.findOne({
    $or: [
      { email },
      { staffId },
      { barcode },
      { phone }
    ]
  });
  return !existingFaculty;
};

// Add new faculty
export const addFaculty = async (req, res) => {
  console.log(req.body); // Log the incoming request body

  try {
    const {
      name,
      bloodGroup,
      email,
      dob,
      gender,
      phone,
      designation,
      staffId,
      barcode,
      classIncharge,
      courseType,
      course,
      section,
      academicYear,
      experience,
      collegeName,
      aadharNumber,
      abcId,
      nationality,
      religion,
      community,
      doorNo,
      street,
      taluk,
      pincode,
      state,
      city,
      country,
      department,
      Qualification,
    } = req.body;

    // Create a new faculty instance
    const newFaculty = new Faculty({
      name,
      bloodGroup,
      email,
      dob,
      gender,
      phone,
      designation,
      staffId,
      barcode,
      classIncharge,
      courseType,
      course,
      section,
      academicYear,
      experience,
      collegeName,
      aadharNumber,
      abcId,
      nationality,
      religion,
      community,
      doorNo,
      street,
      taluk,
      pincode,
      state,
      city,
      country,
      department,
      Qualification,
    });

    // Save the faculty to the database
    await newFaculty.save();
    res.status(201).json({ message: 'Faculty added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the faculty.', error });
  }
};
// Validate faculty fields
// Validate faculty fields
// Validate faculty fields
export const validateFaculty = async (req, res) => {
  console.log(req.body)
  const { email, staffId, barcode, phone } = req.body;

  // Create an array to hold the promises for uniqueness checks
  const uniquenessChecks = [];

  // Only check for uniqueness if the field is provided
  if (email) {
    uniquenessChecks.push(Faculty.findOne({ email }).then(existing => existing ? 'Email' : null));
  }
  if (staffId) {
    uniquenessChecks.push(Faculty.findOne({ staffId }).then(existing => existing ? 'Staff ID' : null));
  }
  if (barcode) {
    uniquenessChecks.push(Faculty.findOne({ barcode }).then(existing => existing ? 'Barcode' : null));
  }
  if (phone) {
    uniquenessChecks.push(Faculty.findOne({ phone }).then(existing => existing ? 'Phone' : null));
  }

  try {
    // Wait for all uniqueness checks to complete
    const results = await Promise.all(uniquenessChecks);
    
    // Filter out null values to find any existing fields
    const existingFields = results.filter(field => field);

    if (existingFields.length > 0) {
      return res.status(400).json({ isUnique: false, message: `${existingFields.join(', ')} already exists.` });
    }

    res.status(200).json({ isUnique: true });
  } catch (err) {
    console.error("Validation failed:", err);
    res.status(500).json({ message: "Validation failed. Please try again." });
  }
};

// Search staff by criteria
export const searchStaff = async (req, res) => {
  try {
    const { staffId, department, designation } = req.body;

    let query = {};
    if (staffId) {
      query.staffId = staffId;
    } else if (department && designation) {
      query = { department, designation };
    } else {
      return res.status(400).json({ message: "Invalid search parameters." });
    }

    const staff = await Faculty.find(query);
    res.json(staff);
  } catch (error) {
    console.error("Error in searchStaff:", error);
    res.status(500).json({ message: "Error fetching staff details." });
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  console.log(req.body)
  const { name } = req.params;
  const updateData = req.body;

  try {
    const faculty = await Faculty.findOneAndUpdate({ name }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found." });
    }

    res.json({ message: "Faculty updated successfully.", faculty });
  } catch (err) {
    console.error("Error updating faculty:", err);
    res.status(500).json({ error: "Failed to update faculty", message: err.message });
  }
};

// Delete faculty
// In your faculty controller
export const deleteFaculty = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    const faculty = await Faculty.findByIdAndDelete(id); // Delete the faculty by ID

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    res.json({ message: "Faculty deleted successfully." });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Error deleting faculty." });
  }
};

// Get faculty details
export const getFacultyDetails = async (req, res) => {
  const { staffId } = req.params;

  try {
    const faculty = await Faculty.findOne({ staffId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found." });
    }
    res.json(faculty);
  } catch (err) {
    console.error("Error fetching faculty details:", err);
    res.status(500).json({ error: "Failed to fetch faculty details." });
  }
};

export const updateFacultyPage = async (req, res) => {
  console.log(req.body)

   const { name } = req.params; const updateData = req.body;

try { const faculty = await Faculty.findOneAndUpdate({ name}, updateData, { new: true, runValidators: true, });

if (!faculty) {
  return res.status(404).json({ error: "Faculty not found" });
}

res.json(faculty);
} catch (err) { console.error("Error updating faculty:", err); // Log the error for debugging res.status(500).json({ error: "Failed to update faculty", message: err.message }); 
} };

export const updateFacultyById = async (req, res) => { const { id } = req.params; 
const { name, course, year, department, section } = req.body;

try { const updatedFaculty = await Faculty.findByIdAndUpdate( id,
   { name, course, year, department, section }, { new: true } );

if (!updatedFaculty) {
  return res.status(404).json({ error: "Faculty not found" });
}

res.json({ message: "Faculty updated successfully", updatedFaculty });
} catch (err) { console.error("Error updating faculty:", err); // Log the error for debugging res.status(500).json({ error: "Failed to update faculty", message: err.message });
 } };


 export const getFieldNames = async (req, res) => {
  try {
    const fieldNames = Object.keys(Faculty.schema.paths);
    res.status(200).json(fieldNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateXLSX = async (req, res) => {
  try {
    // Extract fields from the schema, excluding specific fields
    const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v'];
    const schemaFields = Object.keys(Faculty.schema.paths).filter(
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
    const fileName = `Faculty_schema_fields_${Date.now()}.xlsx`;

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
    const Faculties = await Faculty.find();
    const csvData = Faculties.map(Faculty => Faculty.toObject());
    const csvFilePath = path.join(__dirname, 'Faculties.csv');
    const csvString = csvData.map(row => Object.values(row).join(',')).join('\n');
    fs.writeFileSync(csvFilePath, csvString);
    res.download(csvFilePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkupload = async (req, res) => {
  const { faculty } = req.body;

  if (!faculty || faculty.length === 0) {
    return res.status(400).json({ message: 'No faculties provided' });
  }

  try {
    const result = await Faculty.insertMany(faculty);
    console.log('Inserted records:', result);
    res.json({ message: 'Bulk upload successful', count: result.length });
  } catch (error) {
    console.error('Error bulk uploading faculties:', error);
    res.status(500).json({ message: 'Error bulk uploading faculties', error: error.message });
  }
};

export const BulkFacultyDataDownload = async (req,res) =>{
  try {
    const Faculties = await Faculty.find();
    res.json(Faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
